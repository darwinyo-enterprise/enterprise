using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Enterprise.Library.IntegrationEventLog.IntegrationMigrations
{
    public partial class IntegrationDbContextMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "IntegrationEventLog",
                table => new
                {
                    EventId = table.Column<Guid>(nullable: false),
                    Content = table.Column<string>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    EventTypeName = table.Column<string>(nullable: false),
                    State = table.Column<int>(nullable: false),
                    TimesSent = table.Column<int>(nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_IntegrationEventLog", x => x.EventId); });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "IntegrationEventLog");
        }
    }
}