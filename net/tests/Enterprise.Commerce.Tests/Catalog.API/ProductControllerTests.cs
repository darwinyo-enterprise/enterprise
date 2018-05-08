using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Catalog.API.Infrastructure;
using Enterprise.Commerce.IntegrationTests.Fixture;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Enterprise.Commerce.Tests.Catalog.API
{
    /// <summary>
    /// Test Case
    /// </summary>
    public class ProductControllerTests:IClassFixture<CatalogContextFixture>
    {
        private readonly CatalogContextFixture _catalogContextFixture;
        public ProductControllerTests(CatalogContextFixture catalogContextFixture)
        {
            _catalogContextFixture = catalogContextFixture;
        }
        #region Version 1

        #region Get

        [Fact]
        public async Task Get_manufacturers_response_complete_url_image()
        {
            var options = new DbContextOptionsBuilder<CatalogContext>()
                .UseInMemoryDatabase(databaseName: "Add_writes_to_database")
                .Options;

        }
        [Fact]
        public async Task Get_manufacturer_by_id_response_complete_url_image()
        {
            var options = new DbContextOptionsBuilder<CatalogContext>()
                .UseInMemoryDatabase(databaseName: "Add_writes_to_database")
                .Options;

        }

        #endregion


        #endregion

    }
}
