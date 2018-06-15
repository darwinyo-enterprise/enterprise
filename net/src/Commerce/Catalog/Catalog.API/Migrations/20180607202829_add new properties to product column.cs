using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Catalog.API.Migrations
{
    public partial class addnewpropertiestoproductcolumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Discount",
                table: "Product",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpireDate",
                table: "Product",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "HasExpiry",
                table: "Product",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Product",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinPurchase",
                table: "Product",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalWishlist",
                table: "Product",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discount",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "ExpireDate",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "HasExpiry",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "MinPurchase",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "TotalWishlist",
                table: "Product");
        }
    }
}