using Catalog.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Catalog.API.Infrastructure.EntityConfigurations
{
    public class ProductImageEntityTypeConfiguration : IEntityTypeConfiguration<ProductImage>
    {
        public void Configure(EntityTypeBuilder<ProductImage> builder)
        {
            builder.ToTable("ProductImage");

            // Primary Key
            builder.HasKey(x => x.ImageId);

            builder.Property(x => x.ImageId)
                .ForSqlServerUseSequenceHiLo("product_image_hilo")
                .UseSqlServerIdentityColumn()
                .IsRequired();

            builder.Property(x => x.ImageName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Ignore(x => x.ImageUrl);
        }
    }
}