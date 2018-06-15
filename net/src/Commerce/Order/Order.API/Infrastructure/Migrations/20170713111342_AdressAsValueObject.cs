using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Order.API.Infrastructure.Migrations
{
    public partial class AdressAsValueObject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_orders_address_AddressId",
                schema: "ordering",
                table: "orders");

            migrationBuilder.DropForeignKey(
                "FK_orders_paymentmethods_PaymentMethodId",
                schema: "ordering",
                table: "orders");

            migrationBuilder.DropTable(
                "address",
                "ordering");

            migrationBuilder.DropIndex(
                "IX_orders_AddressId",
                schema: "ordering",
                table: "orders");

            migrationBuilder.DropColumn(
                "AddressId",
                schema: "ordering",
                table: "orders");

            migrationBuilder.AddColumn<string>(
                "Address_City",
                schema: "ordering",
                table: "orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Address_Country",
                schema: "ordering",
                table: "orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Address_State",
                schema: "ordering",
                table: "orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Address_Street",
                schema: "ordering",
                table: "orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Address_ZipCode",
                schema: "ordering",
                table: "orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_orders_paymentmethods_PaymentMethodId",
                schema: "ordering",
                table: "orders");

            migrationBuilder.DropColumn(
                "Address_City",
                schema: "ordering",
                table: "orders");

            migrationBuilder.DropColumn(
                "Address_Country",
                schema: "ordering",
                table: "orders");

            migrationBuilder.DropColumn(
                "Address_State",
                schema: "ordering",
                table: "orders");

            migrationBuilder.DropColumn(
                "Address_Street",
                schema: "ordering",
                table: "orders");

            migrationBuilder.DropColumn(
                "Address_ZipCode",
                schema: "ordering",
                table: "orders");

            migrationBuilder.AddColumn<int>(
                "AddressId",
                schema: "ordering",
                table: "orders",
                nullable: true);

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

            migrationBuilder.CreateIndex(
                "IX_orders_AddressId",
                schema: "ordering",
                table: "orders",
                column: "AddressId");

            migrationBuilder.AddForeignKey(
                "FK_orders_address_AddressId",
                schema: "ordering",
                table: "orders",
                column: "AddressId",
                principalSchema: "ordering",
                principalTable: "address",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}