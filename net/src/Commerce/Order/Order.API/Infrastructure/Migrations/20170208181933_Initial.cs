using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Order.API.Infrastructure.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                "ordering");

            migrationBuilder.CreateSequence(
                "orderitemseq",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                "buyerseq",
                "ordering",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                "orderseq",
                "ordering",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                "paymentseq",
                "ordering",
                incrementBy: 10);

            migrationBuilder.CreateTable(
                "buyers",
                schema: "ordering",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    IdentityGuid = table.Column<string>(maxLength: 200, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_buyers", x => x.Id); });

            migrationBuilder.CreateTable(
                "cardtypes",
                schema: "ordering",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false, defaultValue: 1),
                    Name = table.Column<string>(maxLength: 200, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_cardtypes", x => x.Id); });

            migrationBuilder.CreateTable(
                "address",
                schema: "ordering",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy",
                            SqlServerValueGenerationStrategy.IdentityColumn),
                    City = table.Column<string>(nullable: true),
                    Country = table.Column<string>(nullable: true),
                    State = table.Column<string>(nullable: true),
                    Street = table.Column<string>(nullable: true),
                    ZipCode = table.Column<string>(nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_address", x => x.Id); });

            migrationBuilder.CreateTable(
                "orderstatus",
                schema: "ordering",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false, defaultValue: 1),
                    Name = table.Column<string>(maxLength: 200, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_orderstatus", x => x.Id); });

            migrationBuilder.CreateTable(
                "paymentmethods",
                schema: "ordering",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Alias = table.Column<string>(maxLength: 200, nullable: false),
                    BuyerId = table.Column<int>(nullable: false),
                    CardHolderName = table.Column<string>(maxLength: 200, nullable: false),
                    CardNumber = table.Column<string>(maxLength: 25, nullable: false),
                    CardTypeId = table.Column<int>(nullable: false),
                    Expiration = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_paymentmethods", x => x.Id);
                    table.ForeignKey(
                        "FK_paymentmethods_buyers_BuyerId",
                        x => x.BuyerId,
                        principalSchema: "ordering",
                        principalTable: "buyers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_paymentmethods_cardtypes_CardTypeId",
                        x => x.CardTypeId,
                        principalSchema: "ordering",
                        principalTable: "cardtypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "orders",
                schema: "ordering",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    AddressId = table.Column<int>(nullable: true),
                    BuyerId = table.Column<int>(nullable: false),
                    OrderDate = table.Column<DateTime>(nullable: false),
                    OrderStatusId = table.Column<int>(nullable: false),
                    PaymentMethodId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_orders", x => x.Id);
                    table.ForeignKey(
                        "FK_orders_address_AddressId",
                        x => x.AddressId,
                        principalSchema: "ordering",
                        principalTable: "address",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_orders_buyers_BuyerId",
                        x => x.BuyerId,
                        principalSchema: "ordering",
                        principalTable: "buyers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_orders_orderstatus_OrderStatusId",
                        x => x.OrderStatusId,
                        principalSchema: "ordering",
                        principalTable: "orderstatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_orders_paymentmethods_PaymentMethodId",
                        x => x.PaymentMethodId,
                        principalSchema: "ordering",
                        principalTable: "paymentmethods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "orderItems",
                schema: "ordering",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Discount = table.Column<decimal>(nullable: false),
                    OrderId = table.Column<int>(nullable: false),
                    PictureUrl = table.Column<string>(nullable: true),
                    ProductId = table.Column<int>(nullable: false),
                    ProductName = table.Column<string>(nullable: false),
                    UnitPrice = table.Column<decimal>(nullable: false),
                    Units = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_orderItems", x => x.Id);
                    table.ForeignKey(
                        "FK_orderItems_orders_OrderId",
                        x => x.OrderId,
                        principalSchema: "ordering",
                        principalTable: "orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                "IX_buyers_IdentityGuid",
                schema: "ordering",
                table: "buyers",
                column: "IdentityGuid",
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_paymentmethods_BuyerId",
                schema: "ordering",
                table: "paymentmethods",
                column: "BuyerId");

            migrationBuilder.CreateIndex(
                "IX_paymentmethods_CardTypeId",
                schema: "ordering",
                table: "paymentmethods",
                column: "CardTypeId");

            migrationBuilder.CreateIndex(
                "IX_orders_AddressId",
                schema: "ordering",
                table: "orders",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                "IX_orders_BuyerId",
                schema: "ordering",
                table: "orders",
                column: "BuyerId");

            migrationBuilder.CreateIndex(
                "IX_orders_OrderStatusId",
                schema: "ordering",
                table: "orders",
                column: "OrderStatusId");

            migrationBuilder.CreateIndex(
                "IX_orders_PaymentMethodId",
                schema: "ordering",
                table: "orders",
                column: "PaymentMethodId");

            migrationBuilder.CreateIndex(
                "IX_orderItems_OrderId",
                schema: "ordering",
                table: "orderItems",
                column: "OrderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "orderItems",
                "ordering");

            migrationBuilder.DropTable(
                "orders",
                "ordering");

            migrationBuilder.DropTable(
                "address",
                "ordering");

            migrationBuilder.DropTable(
                "orderstatus",
                "ordering");

            migrationBuilder.DropTable(
                "paymentmethods",
                "ordering");

            migrationBuilder.DropTable(
                "buyers",
                "ordering");

            migrationBuilder.DropTable(
                "cardtypes",
                "ordering");

            migrationBuilder.DropSequence(
                "orderitemseq");

            migrationBuilder.DropSequence(
                "buyerseq",
                "ordering");

            migrationBuilder.DropSequence(
                "orderseq",
                "ordering");

            migrationBuilder.DropSequence(
                "paymentseq",
                "ordering");
        }
    }
}