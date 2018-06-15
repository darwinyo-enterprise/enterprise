using Microsoft.EntityFrameworkCore.Migrations;

namespace Order.API.Infrastructure.Migrations
{
    public partial class AddOrderDescription : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "ordering",
                table: "orders",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                schema: "ordering",
                table: "orders");
        }
    }
}