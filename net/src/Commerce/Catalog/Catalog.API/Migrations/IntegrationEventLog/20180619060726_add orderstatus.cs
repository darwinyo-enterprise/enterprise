using Microsoft.EntityFrameworkCore.Migrations;

namespace Catalog.API.Migrations.IntegrationEventLog
{
    public partial class addorderstatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrderStatus",
                table: "IntegrationEventLog",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderStatus",
                table: "IntegrationEventLog");
        }
    }
}
