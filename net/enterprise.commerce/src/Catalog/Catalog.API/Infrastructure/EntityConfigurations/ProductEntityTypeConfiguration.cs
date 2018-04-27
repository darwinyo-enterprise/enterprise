using Catalog.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Catalog.API.Infrastructure.EntityConfigurations
{
    public class ProductEntityTypeConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Product");

            // Primary Key
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .IsRequired();

            builder.HasOne(ci => ci.Manufacturer)
                .WithMany()
                .HasForeignKey(ci => ci.ManufacturerId);

            builder.HasOne(ci => ci.Category)
                .WithMany()
                .HasForeignKey(ci => ci.CategoryId);

            builder.HasMany(ci => ci.ProductColors)
                .WithOne()
                .HasForeignKey(ci => ci.ProductId);

            builder.HasMany(ci => ci.ProductImages)
                .WithOne()
                .HasForeignKey(ci => ci.ProductId);

            builder.HasMany(ci => ci.ProductRatings)
                .WithOne()
                .HasForeignKey(ci => ci.ProductId);

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Price)
                .IsRequired();

            builder.Property(x => x.OverallRating)
                .IsRequired();

            builder.Property(x => x.TotalFavorites)
                .IsRequired();

            builder.Property(x => x.TotalReviews)
                .IsRequired();

            builder.Property(x => x.Description)
                    .IsRequired(false);

            builder.Property(x => x.AvailableStock)
                .IsRequired();

            builder.Property(x => x.LastUpdated)
                .IsRequired(false);

            builder.Property(x => x.LastUpdatedBy)
                .IsRequired(false);

            // Timestamp
            builder.Property(x => x.Timestamp)
                .IsRowVersion();
        }
    }
}