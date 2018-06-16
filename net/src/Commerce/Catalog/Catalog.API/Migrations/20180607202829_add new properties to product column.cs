using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Catalog.API.Migrations
{
    public partial class Addnewpropertiestoproductcolumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                "Discount",
                "Product",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                "ExpireDate",
                "Product",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                "HasExpiry",
                "Product",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                "Location",
                "Product",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "MinPurchase",
                "Product",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                "TotalWishlist",
                "Product",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "Discount",
                "Product");

            migrationBuilder.DropColumn(
                "ExpireDate",
                "Product");

            migrationBuilder.DropColumn(
                "HasExpiry",
                "Product");

            migrationBuilder.DropColumn(
                "Location",
                "Product");

            migrationBuilder.DropColumn(
                "MinPurchase",
                "Product");

            migrationBuilder.DropColumn(
                "TotalWishlist",
                "Product");
        }
    }
}