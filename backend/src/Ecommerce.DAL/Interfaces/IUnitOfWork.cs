using System;
using System.Threading.Tasks;
using Ecommerce.Common.Entities;

namespace Ecommerce.DAL.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<T> Repository<T>() where T : class;
        
        IRepository<User> Users { get; }
        IRepository<Role> Roles { get; }
        IRepository<Product> Products { get; }
        IRepository<ProductVariant> ProductVariants { get; }
        IRepository<Category> Categories { get; }
        IRepository<Brand> Brands { get; }
        IRepository<Order> Orders { get; }
        IRepository<OrderItem> OrderItems { get; }
        IRepository<Coupon> Coupons { get; }
        IRepository<ProductReview> ProductReviews { get; }
        IRepository<Payment> Payments { get; }
        IRepository<InventoryLog> InventoryLogs { get; }

        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitAsync();
        Task RollbackAsync();
    }
}

