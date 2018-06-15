using System;
using Enterprise.Library.IntegrationEventLog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Order.API.Infrastructure.IntegrationEventMigrations
{
    [DbContext(typeof(IntegrationEventLogContext))]
    internal class IntegrationEventLogContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity(
                "Microsoft.eShopOnContainers.BuildingBlocks.IntegrationEventLogEF.IntegrationEventLogEntry", b =>
                {
                    b.Property<Guid>("EventId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Content")
                        .IsRequired();

                    b.Property<DateTime>("CreationTime");

                    b.Property<string>("EventTypeName")
                        .IsRequired();

                    b.Property<int>("State");

                    b.Property<int>("TimesSent");

                    b.HasKey("EventId");

                    b.ToTable("IntegrationEventLog");
                });
        }
    }
}