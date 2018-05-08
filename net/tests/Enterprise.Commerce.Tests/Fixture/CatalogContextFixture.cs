using System;
using System.Collections.Generic;
using System.Text;
using Catalog.API.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Enterprise.Commerce.IntegrationTests.Fixture
{
    public class CatalogContextFixture:IDisposable
    {
        public CatalogContextFixture()
        {
            var options = new DbContextOptionsBuilder<CatalogContext>()
                .UseInMemoryDatabase(databaseName: "catalog_test_db")
                .Options;
            Context =new CatalogContext(options);
        }
        public void Dispose()
        {
            Context = null;
        }

        public CatalogContext Context { get; set; }
    }
}
