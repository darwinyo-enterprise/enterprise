using Microsoft.EntityFrameworkCore.Migrations;

namespace Order.API.Migrations.IntegrationEventLog
{
    public partial class addorderid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderId",
                table: "IntegrationEventLog",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "IntegrationEventLog");
        }
    }
}
