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
                name: "category_hilo",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "manufacturer_type_hilo",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "product_color_type_hilo",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "product_image_hilo",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "product_rating_hilo",
                incrementBy: 10);

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
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
                name: "Manufacturer",
                columns: table => new
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
                name: "User",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 36, nullable: false),
                    Name = table.Column<string>(maxLength: 500, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_User", x => x.Id); });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
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
                        name: "FK_Product_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Product_Manufacturer_ManufacturerId",
                        column: x => x.ManufacturerId,
                        principalTable: "Manufacturer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductColor",
                columns: table => new
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
                        name: "FK_ProductColor_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductImage",
                columns: table => new
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
                        name: "FK_ProductImage_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProductRating",
                columns: table => new
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
                        name: "FK_ProductRating_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProductRating_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Product_CategoryId",
                table: "Product",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_ManufacturerId",
                table: "Product",
                column: "ManufacturerId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductColor_ProductId",
                table: "ProductColor",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductImage_ProductId",
                table: "ProductImage",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductRating_ProductId",
                table: "ProductRating",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductRating_UserId",
                table: "ProductRating",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductColor");

            migrationBuilder.DropTable(
                name: "ProductImage");

            migrationBuilder.DropTable(
                name: "ProductRating");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "Manufacturer");

            migrationBuilder.DropSequence(
                name: "category_hilo");

            migrationBuilder.DropSequence(
                name: "manufacturer_type_hilo");

            migrationBuilder.DropSequence(
                name: "product_color_type_hilo");

            migrationBuilder.DropSequence(
                name: "product_image_hilo");

            migrationBuilder.DropSequence(
                name: "product_rating_hilo");
        }
    }
}