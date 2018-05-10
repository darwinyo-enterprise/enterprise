using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Catalog.API;
using Catalog.API.Controllers;
using Catalog.API.Helpers;
using Catalog.API.Models;
using Enterprise.Commerce.IntegrationTests.Fixture;
using Enterprise.Commerce.Tests.Fixture;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace Enterprise.Commerce.Tests.Catalog.API
{
    public class ManufacturerControllerTests : IClassFixture<CatalogContextFixture>, IClassFixture<FileUtilityFixture>
    {
        public ManufacturerControllerTests(CatalogContextFixture catalogContextFixture,
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

        #region Utility

        private async Task<List<Manufacturer>> SeedManufacturer(CancellationToken cancellationToken)
        {
            var expectedManufacturer =
                await _catalogContextFixture.Context.Manufacturers.ToListAsync(cancellationToken);
            if (!expectedManufacturer.Any())
            {
                var manufacturers = GetPreconfiguredManufacturer();

                var enumerable = manufacturers.ToList();
                await _catalogContextFixture.Context.Manufacturers.AddRangeAsync(enumerable,
                    cancellationToken);
                await _catalogContextFixture.Context.SaveChangesAsync(cancellationToken);
            }

            expectedManufacturer = await _catalogContextFixture.Context.Manufacturers.ToListAsync(cancellationToken);
            return expectedManufacturer;
        }

        private IEnumerable<Manufacturer> GetPreconfiguredManufacturer()
        {
            return new List<Manufacturer>
            {
                new Manufacturer {Name = "Microsoft", Description = "None", ImageName = "Microsoft.png"},
                new Manufacturer {Name = "Asus", Description = "None", ImageName = "Asus.png"},
                new Manufacturer {Name = "Apple", Description = "None", ImageName = "Apple.png"},
                new Manufacturer {Name = "Google", Description = "None", ImageName = "Google.png"},
                new Manufacturer {Name = "Docker", Description = "None", ImageName = "Docker.png"},
                new Manufacturer {Name = "Sony", Description = "None", ImageName = "Sony.png"}
            };
        }

        private Manufacturer GetTestManufacturer()
        {
            return new Manufacturer()
            {
                Description = "Test",
                ImageUrl =
                    "data:image/png;base64,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",
                ImageName = "Test.jpg",
                Name = "Test Manufacturer"
            };
        }

        private async Task CleanManufacturer()
        {
            _catalogContextFixture.Context.Manufacturers.RemoveRange(await _catalogContextFixture.Context
               .Manufacturers.ToListAsync());
            await _catalogContextFixture.Context.SaveChangesAsync();
        }

        #endregion

        #region Get

        [Fact]
        public async Task Get_manufacturer_by_id_response_bad_request_when_id_less_or_equals_zero()
        {
            var id = 0;
            var cancellationToken = new CancellationToken();
            // Arrange
            await SeedManufacturer(cancellationToken);

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.GetManufacturerByIdAsync(id, cancellationToken);
            Assert.IsType<BadRequestResult>(response);
        }

        [Fact]
        public async Task Get_manufacturer_by_id_response_complete_url_image()
        {
            var id = 1;
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedManufacturer = await SeedManufacturer(cancellationToken);

            var expectedResult = UrlImageHelper<Manufacturer>.ChangeUriPlaceholder(expectedManufacturer[0],
                _settings.Value.ManufacturerImageBaseUrl,
                _settings.Value.AzureStorageEnabled);

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.GetManufacturerByIdAsync(id, cancellationToken);
            var okResponse = Assert.IsType<OkObjectResult>(response);

            var modelResponse = Assert.IsType<Manufacturer>(okResponse.Value);

            // Assert
            Assert.Equal(modelResponse.Name, expectedResult.Name);
            Assert.Equal(modelResponse.Description, expectedResult.Description);
            Assert.Equal(modelResponse.ImageName, expectedResult.ImageName);
            Assert.Equal(_settings.Value.ManufacturerImageBaseUrl + modelResponse.Id + "/" + modelResponse.ImageName,
                expectedResult.ImageUrl);
        }

        [Fact]
        public async Task Get_manufacturer_by_id_response_not_found_when_item_not_exists()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedManufacturer = await SeedManufacturer(cancellationToken);

            Assert.NotEmpty(expectedManufacturer);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedManufacturer.LastOrDefault().Id++;

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.GetManufacturerByIdAsync(id, cancellationToken);
            Assert.IsType<NotFoundResult>(response);
        }

        [Fact]
        public async Task Get_manufacturer_image_by_id_response_bad_request_when_id_less_or_equals_zero()
        {
            var id = 0;
            var cancellationToken = new CancellationToken();
            // Arrange
            await SeedManufacturer(cancellationToken);

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.GetManufacturerImage(id, cancellationToken);
            Assert.IsType<BadRequestResult>(response);
        }

        [Fact]
        public async Task Get_manufacturer_image_by_id_response_not_found_when_item_not_exists()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedManufacturer = await SeedManufacturer(cancellationToken);

            Assert.NotEmpty(expectedManufacturer);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedManufacturer.LastOrDefault().Id++;

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.GetManufacturerImage(id, cancellationToken);
            Assert.IsType<NotFoundResult>(response);
        }

        [Fact]
        public async Task Get_manufacturers_response_complete_url_image()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedManufacturer = await SeedManufacturer(cancellationToken);

            var expectedResult = UrlImageHelper<Manufacturer>.ChangeUriPlaceholder(expectedManufacturer,
                _settings.Value.ManufacturerImageBaseUrl,
                _settings.Value.AzureStorageEnabled);

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.GetAllManufacturersAsync(cancellationToken);
            var okResponse = Assert.IsType<OkObjectResult>(response);

            var modelResponse = Assert.IsType<List<Manufacturer>>(okResponse.Value);
            Assert.Equal(expectedResult.Count, modelResponse.Count);

            // Assert
            Assert.Equal(modelResponse[0].Name, expectedResult[0].Name);
            Assert.Equal(modelResponse[0].Description, expectedResult[0].Description);
            Assert.Equal(modelResponse[0].ImageName, expectedResult[0].ImageName);
            Assert.Equal(
                _settings.Value.ManufacturerImageBaseUrl + modelResponse[0].Id + "/" + modelResponse[0].ImageName,
                expectedResult[0].ImageUrl);
        }

        #endregion

        #region Post

        [Fact]
        public async Task Post_manufacturer_response_complete_url_image()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            await CleanManufacturer();
            var expectedManufacturer = await SeedManufacturer(cancellationToken);

            var expectedResult = UrlImageHelper<Manufacturer>.ChangeUriPlaceholder(expectedManufacturer,
                _settings.Value.ManufacturerImageBaseUrl,
                _settings.Value.AzureStorageEnabled);

            // Expect to be clean
            Assert.Equal(expectedResult.Count, GetPreconfiguredManufacturer().Count());

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.AddNewManufacturer(GetTestManufacturer(), cancellationToken);
            var okResponse = Assert.IsType<CreatedAtActionResult>(response);
            
        }

        #endregion


        //[Fact]
        //public async Task Put_manufacturers_response_complete_url_image()
        //{
        //    var cancellationToken = new CancellationToken();
        //    // Arrange
        //    var expectedManufacturer = await SeedManufacturer(cancellationToken);

        //    var expectedResult = UrlImageHelper<Manufacturer>.ChangeUriPlaceholder(expectedManufacturer,
        //        _settings.Value.ManufacturerImageBaseUrl,
        //        _settings.Value.AzureStorageEnabled);

        //    // Act
        //    var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
        //        _fileUtilityFixture.FileUtility, _settings);
        //    var response = await manufacturerController.GetAllManufacturersAsync(cancellationToken);
        //    var okResponse = Assert.IsType<OkObjectResult>(response);

        //    var modelResponse = Assert.IsType<List<Manufacturer>>(okResponse.Value);
        //    Assert.Equal(expectedResult.Count, modelResponse.Count);

        //    // Assert
        //    Assert.Equal(modelResponse[0].Name, expectedResult[0].Name);
        //    Assert.Equal(modelResponse[0].Description, expectedResult[0].Description);
        //    Assert.Equal(modelResponse[0].ImageName, expectedResult[0].ImageName);
        //    Assert.Equal(
        //        _settings.Value.ManufacturerImageBaseUrl + modelResponse[0].Id + "/" + modelResponse[0].ImageName,
        //        expectedResult[0].ImageUrl);
        //}
    }
}