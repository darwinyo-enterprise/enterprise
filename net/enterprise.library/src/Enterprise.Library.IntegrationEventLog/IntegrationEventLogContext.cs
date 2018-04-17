using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enterprise.Library.IntegrationEventLog
{
    public class IntegrationEventLogContext : DbContext
    {
        public DbSet<IntegrationEventLogEntry> IntegrationEventLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IntegrationEventLogEntry>(ConfigureIntegrationEventLogEntry);
        }

        private void ConfigureIntegrationEventLogEntry(EntityTypeBuilder<IntegrationEventLogEntry> builder)
        {
            builder.ToTable("Infrastructure.IntegrationEventLog");
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
        }
    }
}