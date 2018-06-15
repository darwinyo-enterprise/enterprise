using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Catalog.API.Migrations
{
    public partial class changeIdlengthto36 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(
                "category_hilo",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                "manufacturer_type_hilo",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                "product_color_type_hilo",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                "product_image_hilo",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                "product_rating_hilo",
                incrementBy: 10);

            migrationBuilder.CreateTable(
                "Category",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy",
                            SqlServerValueGenerationStrategy.IdentityColumn),
                    Description = table.Column<string>(nullable: true),
                    ImageName = table.Column<string>(nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Timestamp = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_Category", x => x.Id); });

            migrationBuilder.CreateTable(
                "Manufacturer",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy",
                            SqlServerValueGenerationStrategy.IdentityColumn),
                    Description = table.Column<string>(nullable: true),
                    ImageName = table.Column<string>(nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Timestamp = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_Manufacturer", x => x.Id); });

            migrationBuilder.CreateTable(
                "User",
                table => new
                {
                    Id = table.Column<string>(maxLength: 36, nullable: false),
                    Name = table.Column<string>(maxLength: 500, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_User", x => x.Id); });

            migrationBuilder.CreateTable(
                "Product",
                table => new
                {
                    Id = table.Column<string>(maxLength: 36, nullable: false),
                    AvailableStock = table.Column<int>(nullable: false),
                    CategoryId = table.Column<int>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    LastUpdated = table.Column<DateTime>(nullable: true),
                    LastUpdatedBy = table.Column<string>(nullable: true),
                    ManufacturerId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    OverallRating = table.Column<decimal>(nullable: false),
                    Price = table.Column<decimal>(nullable: false),
                    Timestamp = table.Column<byte[]>(rowVersion: true, nullable: true),
                    TotalFavorites = table.Column<int>(nullable: false),
                    TotalReviews = table.Column<int>(nullable: false),
                    TotalSold = table.Column<int>(nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.Id);
                    table.ForeignKey(
                        "FK_Product_Category_CategoryId",
                        x => x.CategoryId,
                        "Category",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_Product_Manufacturer_ManufacturerId",
                        x => x.ManufacturerId,
                        "Manufacturer",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "ProductColor",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy",
                            SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    ProductId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductColor", x => x.Id);
                    table.ForeignKey(
                        "FK_ProductColor_Product_ProductId",
                        x => x.ProductId,
                        "Product",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "ProductImage",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy",
                            SqlServerValueGenerationStrategy.IdentityColumn),
                    ImageName = table.Column<string>(maxLength: 100, nullable: false),
                    ProductId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductImage", x => x.Id);
                    table.ForeignKey(
                        "FK_ProductImage_Product_ProductId",
                        x => x.ProductId,
                        "Product",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "ProductRating",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy",
                            SqlServerValueGenerationStrategy.IdentityColumn),
                    ProductId = table.Column<string>(nullable: true),
                    Rate = table.Column<decimal>(nullable: false),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductRating", x => x.Id);
                    table.ForeignKey(
                        "FK_ProductRating_Product_ProductId",
                        x => x.ProductId,
                        "Product",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_ProductRating_User_UserId",
                        x => x.UserId,
                        "User",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                "IX_Product_CategoryId",
                "Product",
                "CategoryId");

            migrationBuilder.CreateIndex(
                "IX_Product_ManufacturerId",
                "Product",
                "ManufacturerId");

            migrationBuilder.CreateIndex(
                "IX_ProductColor_ProductId",
                "ProductColor",
                "ProductId");

            migrationBuilder.CreateIndex(
                "IX_ProductImage_ProductId",
                "ProductImage",
                "ProductId");

            migrationBuilder.CreateIndex(
                "IX_ProductRating_ProductId",
                "ProductRating",
                "ProductId");

            migrationBuilder.CreateIndex(
                "IX_ProductRating_UserId",
                "ProductRating",
                "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "ProductColor");

            migrationBuilder.DropTable(
                "ProductImage");

            migrationBuilder.DropTable(
                "ProductRating");

            migrationBuilder.DropTable(
                "Product");

            migrationBuilder.DropTable(
                "User");

            migrationBuilder.DropTable(
                "Category");

            migrationBuilder.DropTable(
                "Manufacturer");

            migrationBuilder.DropSequence(
                "category_hilo");

            migrationBuilder.DropSequence(
                "manufacturer_type_hilo");

            migrationBuilder.DropSequence(
                "product_color_type_hilo");

            migrationBuilder.DropSequence(
                "product_image_hilo");

            migrationBuilder.DropSequence(
                "product_rating_hilo");
        }
    }
}