using System.Threading.Tasks;
using Catalog.API.Infrastructure.EntityConfigurations;
using Catalog.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Catalog.API.Infrastructure
{
    public class CatalogContext : DbContext
    {
        public CatalogContext(DbContextOptions<CatalogContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Manufacturer> Manufacturers { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductRating> ProductRatings { get; set; }
        public DbSet<ProductColor> ProductColors { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new ManufacturerEntityTypeConfiguration());
            builder.ApplyConfiguration(new CategoryEntityTypeConfiguration());
            builder.ApplyConfiguration(new ProductEntityTypeConfiguration());
            builder.ApplyConfiguration(new ProductColorEntityTypeConfiguration());
            builder.ApplyConfiguration(new ProductImageEntityTypeConfiguration());
            builder.ApplyConfiguration(new ProductRatingEntityTypeConfiguration());
            builder.ApplyConfiguration(new UserEntityTypeConfiguration());
        }

        /// <summary>
        ///     used for reset identity seed back to 0
        /// </summary>
        /// <param name="tableName">
        ///     table name to reset
        /// </param>
        /// <returns></returns>
        public async Task SpResetIdentity(string tableName)
        {
            await Database.ExecuteSqlCommandAsync("EXEC	[spResetIdentity] @TableName='" + tableName + "'");
        }
    }


    public class CatalogContextDesignFactory : IDesignTimeDbContextFactory<CatalogContext>
    {
        public CatalogContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<CatalogContext>()
                .UseSqlServer(
                    "Server=tcp:127.0.0.1,5433;Initial Catalog=Enterprise.Commerce.Services.CatalogDb;User ImageId=sa;Password=P@ssw0rd");

            return new CatalogContext(optionsBuilder.Options);
        }
    }
}