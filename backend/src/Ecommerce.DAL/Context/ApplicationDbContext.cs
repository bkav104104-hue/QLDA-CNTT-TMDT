using Microsoft.EntityFrameworkCore;
using Ecommerce.Common.Entities;

namespace Ecommerce.DAL.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Role> Roles => Set<Role>();
        public DbSet<User> Users => Set<User>();
        public DbSet<UserAddress> UserAddresses => Set<UserAddress>();
        public DbSet<Brand> Brands => Set<Brand>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
        public DbSet<Coupon> Coupons => Set<Coupon>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<ProductReview> ProductReviews => Set<ProductReview>();
        public DbSet<InventoryLog> InventoryLogs => Set<InventoryLog>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User - Phone Unique Index
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.PhoneNumber).IsUnique();
                entity.Property(u => u.PhoneNumber).HasMaxLength(20).IsRequired();
                entity.Property(u => u.FullName).HasMaxLength(150).IsRequired();
                entity.Property(u => u.Email).HasMaxLength(150);
            });

            // Product Configurations
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasIndex(p => p.Slug).IsUnique();
                entity.Property(p => p.Name).HasMaxLength(255).IsRequired();
                entity.Property(p => p.BasePrice).HasPrecision(18, 2);
                entity.Property(p => p.OriginalPrice).HasPrecision(18, 2);
                entity.Property(p => p.MemberDiscountPercent).HasPrecision(5, 2);

                entity.HasOne(p => p.Brand)
                    .WithMany(b => b.Products)
                    .HasForeignKey(p => p.BrandId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.Category)
                    .WithMany(c => c.Products)
                    .HasForeignKey(p => p.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ProductVariant Configurations
            modelBuilder.Entity<ProductVariant>(entity =>
            {
                entity.HasIndex(pv => pv.Sku).IsUnique();
                entity.Property(pv => pv.Price).HasPrecision(18, 2);
                entity.Property(pv => pv.OriginalPrice).HasPrecision(18, 2);
            });

            // Order & OrderItems
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasIndex(o => o.OrderCode).IsUnique();
                entity.Property(o => o.SubTotal).HasPrecision(18, 2);
                entity.Property(o => o.DiscountAmount).HasPrecision(18, 2);
                entity.Property(o => o.ShippingFee).HasPrecision(18, 2);
                entity.Property(o => o.TotalAmount).HasPrecision(18, 2);

                entity.HasMany(o => o.Items)
                    .WithOne(i => i.Order)
                    .HasForeignKey(i => i.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.Property(oi => oi.UnitPrice).HasPrecision(18, 2);
                entity.Property(oi => oi.TotalPrice).HasPrecision(18, 2);
            });

            modelBuilder.Entity<Coupon>(entity =>
            {
                entity.HasIndex(c => c.Code).IsUnique();
                entity.Property(c => c.DiscountValue).HasPrecision(18, 2);
                entity.Property(c => c.MinOrderAmount).HasPrecision(18, 2);
                entity.Property(c => c.MaxDiscountAmount).HasPrecision(18, 2);
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.Property(p => p.Amount).HasPrecision(18, 2);
            });
        }
    }
}

