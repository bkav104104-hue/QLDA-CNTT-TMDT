using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using Ecommerce.Common.Entities;
using Ecommerce.DAL.Context;
using Ecommerce.DAL.Interfaces;

namespace Ecommerce.DAL.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;
        private readonly ConcurrentDictionary<Type, object> _repositories = new();

        private IRepository<User>? _users;
        private IRepository<Role>? _roles;
        private IRepository<Product>? _products;
        private IRepository<ProductVariant>? _productVariants;
        private IRepository<Category>? _categories;
        private IRepository<Brand>? _brands;
        private IRepository<Order>? _orders;
        private IRepository<OrderItem>? _orderItems;
        private IRepository<Coupon>? _coupons;
        private IRepository<ProductReview>? _productReviews;
        private IRepository<Payment>? _payments;
        private IRepository<InventoryLog>? _inventoryLogs;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IRepository<T> Repository<T>() where T : class
        {
            return (IRepository<T>)_repositories.GetOrAdd(typeof(T), _ => new Repository<T>(_context));
        }

        public IRepository<User> Users => _users ??= new Repository<User>(_context);
        public IRepository<Role> Roles => _roles ??= new Repository<Role>(_context);
        public IRepository<Product> Products => _products ??= new Repository<Product>(_context);
        public IRepository<ProductVariant> ProductVariants => _productVariants ??= new Repository<ProductVariant>(_context);
        public IRepository<Category> Categories => _categories ??= new Repository<Category>(_context);
        public IRepository<Brand> Brands => _brands ??= new Repository<Brand>(_context);
        public IRepository<Order> Orders => _orders ??= new Repository<Order>(_context);
        public IRepository<OrderItem> OrderItems => _orderItems ??= new Repository<OrderItem>(_context);
        public IRepository<Coupon> Coupons => _coupons ??= new Repository<Coupon>(_context);
        public IRepository<ProductReview> ProductReviews => _productReviews ??= new Repository<ProductReview>(_context);
        public IRepository<Payment> Payments => _payments ??= new Repository<Payment>(_context);
        public IRepository<InventoryLog> InventoryLogs => _inventoryLogs ??= new Repository<InventoryLog>(_context);

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            if (_transaction != null) return;
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitAsync()
        {
            try
            {
                if (_transaction != null)
                {
                    await _context.SaveChangesAsync();
                    await _transaction.CommitAsync();
                }
            }
            catch
            {
                await RollbackAsync();
                throw;
            }
            finally
            {
                if (_transaction != null)
                {
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
            }
        }

        public async Task RollbackAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}

