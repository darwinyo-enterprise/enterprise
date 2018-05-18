using Catalog.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Catalog.API.Infrastructure.EntityConfigurations
{
    public class ProductRatingEntityTypeConfiguration : IEntityTypeConfiguration<ProductRating>
    {
        public void Configure(EntityTypeBuilder<ProductRating> builder)
        {
            builder.ToTable("ProductRating");

            // Primary Key
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .ForSqlServerUseSequenceHiLo("product_rating_hilo")
                .UseSqlServerIdentityColumn()
                .IsRequired();

            builder.Property(x => x.Rate)
                .IsRequired();

            builder.HasOne(ci => ci.User)
                .WithMany(ci => ci.ProductRatings)
                .HasForeignKey(ci => ci.UserId);
        }
    }
}