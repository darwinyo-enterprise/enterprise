﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enterprise.Library.IntegrationEventLog
{
    public class IntegrationEventLogContext : DbContext
    {
        public IntegrationEventLogContext(DbContextOptions<IntegrationEventLogContext> options) : base(options)
        {
        }

        public DbSet<IntegrationEventLogEntry> IntegrationEventLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<IntegrationEventLogEntry>(ConfigureIntegrationEventLogEntry);
        }

        private void ConfigureIntegrationEventLogEntry(EntityTypeBuilder<IntegrationEventLogEntry> builder)
        {
            builder.ToTable("IntegrationEventLog");

            builder.HasKey(e => e.EventId);

            builder.Property(e => e.EventId)
                .IsRequired();

            builder.Property(e => e.Content)
                .IsRequired();

            builder.Property(e => e.CreationTime)
                .IsRequired();

            builder.Property(e => e.State)
                .IsRequired();

            builder.Property(e => e.TimesSent)
                .IsRequired();

            builder.Property(e => e.EventTypeName)
                .IsRequired();


            builder.Property(e => e.OrderId)
                .IsRequired();

            builder.Property(e => e.OrderStatus)
                .IsRequired();
        }
    }

    public class IntegrationEventLogContextDesignFactory : IDesignTimeDbContextFactory<IntegrationEventLogContext>
    {
        public IntegrationEventLogContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<IntegrationEventLogContext>()
                .UseSqlServer(
                    "Server=.;Initial Catalog=Enterprise.Commerce.Services.IntegrationEventLog;Integrated Security=true", b =>
                     {
                         //b.MigrationsAssembly("Catalog.API");
                         b.MigrationsAssembly("Order.API");
                     });

            return new IntegrationEventLogContext(optionsBuilder.Options);
        }
    }
}