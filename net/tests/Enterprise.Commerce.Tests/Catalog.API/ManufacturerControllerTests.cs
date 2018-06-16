using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Catalog.API;
using Catalog.API.Controllers;
using Catalog.API.Models;
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
                new Manufacturer
                {
                    Name = "Microsoft",
                    Description = "None",
                    ImageName = "Microsoft.png",
                    ImageUrl = "TestUrl"
                },
                new Manufacturer {Name = "Asus", Description = "None", ImageName = "Asus.png", ImageUrl = "TestUrl"},
                new Manufacturer {Name = "Apple", Description = "None", ImageName = "Apple.png", ImageUrl = "TestUrl"},
                new Manufacturer
                {
                    Name = "Google",
                    Description = "None",
                    ImageName = "Google.png",
                    ImageUrl = "TestUrl"
                },
                new Manufacturer
                {
                    Name = "Docker",
                    Description = "None",
                    ImageName = "Docker.png",
                    ImageUrl = "TestUrl"
                },
                new Manufacturer {Name = "Sony", Description = "None", ImageName = "Sony.png", ImageUrl = "TestUrl"}
            };
        }

        private Manufacturer GetTestManufacturerEmptyImage()
        {
            return new Manufacturer
            {
                Description = "Test",
                ImageUrl = "",
                ImageName = "",
                Name = "Test Manufacturer"
            };
        }

        [Fact]
        public async Task Delete_manufacturer_response_bad_request_with_message_when_id_less_or_equals_zero()
        {
            var id = 0;
            var cancellationToken = new CancellationToken();

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.DeleteManufacturerAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Delete_manufacturer_response_bad_request_with_message_when_manufacturer_hooked_with_product()
        {
            var cancellationToken = new CancellationToken();

            var expectedManufacturer =
                await _catalogContextFixture.Context.Manufacturers.ToListAsync(cancellationToken);

            if (expectedManufacturer.IsNullOrEmpty()) expectedManufacturer = await SeedManufacturer(cancellationToken);

            Assert.NotEmpty(expectedManufacturer);

            var id = (await _catalogContextFixture.Context.Manufacturers.FirstOrDefaultAsync(
                cancellationToken)).Id;
            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.DeleteManufacturerAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Delete_manufacturer_response_not_found_with_message_when_item_not_found()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedManufacturer =
                await _catalogContextFixture.Context.Manufacturers.ToListAsync(cancellationToken);

            if (expectedManufacturer.IsNullOrEmpty()) expectedManufacturer = await SeedManufacturer(cancellationToken);

            Assert.NotEmpty(expectedManufacturer);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedManufacturer.LastOrDefault().Id++;

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.DeleteManufacturerAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<NotFoundObjectResult>(response);

            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Get_manufacturer_by_id_response_bad_request_with_message_when_id_less_or_equals_zero()
        {
            var id = 0;
            var cancellationToken = new CancellationToken();

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.GetManufacturerByIdAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Get_manufacturer_by_id_response_not_found_when_item_not_exists()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedManufacturer =
                await _catalogContextFixture.Context.Manufacturers.ToListAsync(cancellationToken);

            if (expectedManufacturer.IsNullOrEmpty()) expectedManufacturer = await SeedManufacturer(cancellationToken);

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
        public async Task Get_manufacturer_image_by_id_response_bad_request_with_message_when_id_less_or_equals_zero()
        {
            var id = 0;
            var cancellationToken = new CancellationToken();

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.GetManufacturerImageAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Get_manufacturer_image_by_id_response_not_found_when_item_not_exists()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedManufacturer =
                await _catalogContextFixture.Context.Manufacturers.ToListAsync(cancellationToken);

            if (expectedManufacturer.IsNullOrEmpty()) expectedManufacturer = await SeedManufacturer(cancellationToken);

            Assert.NotEmpty(expectedManufacturer);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedManufacturer.LastOrDefault().Id++;

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.GetManufacturerImageAsync(id, cancellationToken);
            Assert.IsType<NotFoundResult>(response);
        }

        [Fact]
        public async Task
            Get_manufacturer_list_response_bad_request_with_message_when_pagination_index_is_negative_or_page_size_zero_or_negative()
        {
            var cancellationToken = new CancellationToken();

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.GetListManufacturersAsync(cancellationToken, 0, -10);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Post_manufacturer_response_bad_request_with_message_when_manufacturer_exists()
        {
            var cancellationToken = new CancellationToken();
            //Arrange
            var expectedManufacturer =
                await _catalogContextFixture.Context.Manufacturers.ToListAsync(cancellationToken);

            if (expectedManufacturer.IsNullOrEmpty()) expectedManufacturer = await SeedManufacturer(cancellationToken);

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response =
                await manufacturerController.AddNewManufacturerAsync(expectedManufacturer[0], cancellationToken);
            var badRequestResponse = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", badRequestResponse.Value.ToString());
        }

        [Fact]
        public async Task Post_manufacturer_response_bad_request_with_message_when_manufacturer_image_is_empty()
        {
            var cancellationToken = new CancellationToken();
            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response =
                await manufacturerController.AddNewManufacturerAsync(GetTestManufacturerEmptyImage(),
                    cancellationToken);
            var badRequestResponse = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", badRequestResponse.Value.ToString());
        }

        [Fact]
        public async Task Post_manufacturer_response_bad_request_with_message_when_manufacturer_null()
        {
            var cancellationToken = new CancellationToken();

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await manufacturerController.AddNewManufacturerAsync(null, cancellationToken);
            var badRequestResponse = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", badRequestResponse.Value.ToString());
        }

        [Fact]
        public async Task
            Update_manufacturer_response_bad_request_with_message_when_item_image_url_or_image_name_is_not_provided()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedManufacturer =
                await _catalogContextFixture.Context.Manufacturers.ToListAsync(cancellationToken);

            if (expectedManufacturer.IsNullOrEmpty()) expectedManufacturer = await SeedManufacturer(cancellationToken);

            Assert.NotEmpty(expectedManufacturer);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedManufacturer[0].Id;
            expectedManufacturer[0].ImageName = "";
            expectedManufacturer[0].ImageUrl = "";
            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response =
                await manufacturerController.UpdateManufacturerAsync(id, expectedManufacturer[0], cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);

            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Update_manufacturer_response_not_found_with_message_when_item_not_exists()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedManufacturer =
                await _catalogContextFixture.Context.Manufacturers.ToListAsync(cancellationToken);

            if (expectedManufacturer.IsNullOrEmpty()) expectedManufacturer = await SeedManufacturer(cancellationToken);

            Assert.NotEmpty(expectedManufacturer);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedManufacturer.LastOrDefault().Id++;

            // Act
            var manufacturerController = new ManufacturerController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response =
                await manufacturerController.UpdateManufacturerAsync(id, expectedManufacturer[0], cancellationToken);
            var responseMessage = Assert.IsType<NotFoundObjectResult>(response);

            Assert.Contains("Message", responseMessage.Value.ToString());
        }
    }
}