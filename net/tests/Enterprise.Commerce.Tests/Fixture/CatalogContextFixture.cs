using System;
using Catalog.API.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Enterprise.Commerce.Tests.Fixture
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