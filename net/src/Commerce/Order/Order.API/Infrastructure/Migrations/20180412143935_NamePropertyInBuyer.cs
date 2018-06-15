using Microsoft.EntityFrameworkCore.Migrations;

namespace Order.API.Infrastructure.Migrations
{
    public partial class NamePropertyInBuyer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_orderItems_orders_OrderId",
                schema: "ordering",
                table: "orderItems");

            migrationBuilder.AddColumn<string>(
                "Name",
                schema: "ordering",
                table: "buyers",
                nullable: true);

            migrationBuilder.AddForeignKey(
                "FK_orderItems_orders_OrderId",
                schema: "ordering",
                table: "orderItems",
                column: "OrderId",
                principalSchema: "ordering",
                principalTable: "orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_orderItems_orders_OrderId",
                schema: "ordering",
                table: "orderItems");

            migrationBuilder.DropColumn(
                "Name",
                schema: "ordering",
                table: "buyers");

            migrationBuilder.AddColumn<string>(
                "City",
                schema: "ordering",
                table: "orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Country",
                schema: "ordering",
                table: "orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "State",
                schema: "ordering",
                table: "orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Street",
                schema: "ordering",
                table: "orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "ZipCode",
                schema: "ordering",
                table: "orders",
                nullable: true);

            migrationBuilder.AddForeignKey(
                "FK_orderItems_orders_OrderId",
                schema: "ordering",
                table: "orderItems",
                column: "OrderId",
                principalSchema: "ordering",
                principalTable: "orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}