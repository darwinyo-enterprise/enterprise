using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Identity.API.Migrations.PersistedGrantDb
{
    public partial class InitialGrantmigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "PersistedGrants",
                table => new
                {
                    Key = table.Column<string>(maxLength: 200, nullable: false),
                    ClientId = table.Column<string>(maxLength: 200, nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    Data = table.Column<string>(maxLength: 50000, nullable: false),
                    Expiration = table.Column<DateTime>(nullable: true),
                    SubjectId = table.Column<string>(maxLength: 200, nullable: true),
                    Type = table.Column<string>(maxLength: 50, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_PersistedGrants", x => x.Key); });

            migrationBuilder.CreateIndex(
                "IX_PersistedGrants_SubjectId_ClientId_Type",
                "PersistedGrants",
                new[] {"SubjectId", "ClientId", "Type"});
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "PersistedGrants");
        }
    }
}