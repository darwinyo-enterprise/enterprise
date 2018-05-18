using Catalog.API;
using Enterprise.Commerce.IntegrationTests.Fixture;
using Enterprise.Commerce.Tests.Fixture;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace Enterprise.Commerce.Tests.Catalog.API
{
    /// <summary>
    ///     Test Case
    /// </summary>
    public class ProductControllerTests : IClassFixture<CatalogContextFixture>, IClassFixture<FileUtilityFixture>
    {
        public ProductControllerTests(CatalogContextFixture catalogContextFixture,
            FileUtilityFixture fileUtilityFixture)
        {
            var catalogSettings = new CatalogSettings
            {
                AzureStorageEnabled = false,
                CategoryImageBaseUrl = "http://localhost:5101/api/v1/category/image/",
                EventBusConnection = "localhost",
                ManufacturerImageBaseUrl = "http://localhost:5101/api/v1/manufacturer/image/",
                ProductImageBaseUrl = "http://localhost:5101/api/v1/product/image/",
                UseCustomizationData = true
            };
            _catalogContextFixture = catalogContextFixture;
            _fileUtilityFixture = fileUtilityFixture;

            var settings = new Mock<IOptionsSnapshot<CatalogSettings>>();
            settings.Setup(x => x.Value).Returns(catalogSettings);
            _settings = settings.Object;
        }

        private readonly CatalogContextFixture _catalogContextFixture;
        private readonly FileUtilityFixture _fileUtilityFixture;

        private readonly IOptionsSnapshot<CatalogSettings> _settings;
        
    }
}