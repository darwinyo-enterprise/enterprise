using Catalog.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Catalog.API.Infrastructure.EntityConfigurations
{
    public class ManufacturerEntityTypeConfiguration : IEntityTypeConfiguration<Manufacturer>
    {
        public void Configure(EntityTypeBuilder<Manufacturer> builder)
        {
            builder.ToTable("Manufacturer");

            // Primary Key
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .ForSqlServerUseSequenceHiLo("catalog_type_hilo")
                .IsRequired();

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Description)
                .IsRequired(false);

            builder.Property(x => x.ImageUrl)
                .IsRequired();

            // Timestamp
            builder.Property(x => x.Timestamp)
                .IsRowVersion();
        }
    }
}