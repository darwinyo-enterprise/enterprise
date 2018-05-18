using System;
using Catalog.API.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Enterprise.Commerce.IntegrationTests.Fixture
{
    public class CatalogContextFixture : IDisposable
    {
        public CatalogContextFixture()
        {
            var options = new DbContextOptionsBuilder<CatalogContext>()
                .UseInMemoryDatabase("catalog_test_db")
                .Options;
            Context = new CatalogContext(options);
        }

        public CatalogContext Context { get; set; }

        public void Dispose()
        {
            Context = null;
        }
    }
}