﻿using Microsoft.EntityFrameworkCore.Migrations;

// ReSharper disable once CheckNamespace
namespace Catalog.API.Migrations
{
    public partial class SpResetIdentity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp = @"CREATE PROCEDURE [dbo].[spResetIdentity]
                        @TableName varchar(MAX)
                    AS
                    BEGIN
                        SET NOCOUNT ON;
                        DBCC CHECKIDENT (@TableName, RESEED, 0); 
                    END";

            migrationBuilder.Sql(sp);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}