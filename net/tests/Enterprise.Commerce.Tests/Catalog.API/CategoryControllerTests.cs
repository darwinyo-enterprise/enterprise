using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Catalog.API;
using Catalog.API.Controllers;
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
    public class CategoryControllerTests : IClassFixture<CatalogContextFixture>, IClassFixture<FileUtilityFixture>
    {
        public CategoryControllerTests(CatalogContextFixture catalogContextFixture,
            FileUtilityFixture fileUtilityFixture)
        {
            var catalogSettings = new CatalogSettings
            {
                AzureStorageEnabled = false,
                EventBusConnection = "localhost",
                CategoryImageBaseUrl = "http://localhost:5101/api/v1/Category/image/",
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

        private async Task<List<Category>> SeedCategory(CancellationToken cancellationToken)
        {
            var expectedCategory =
                await _catalogContextFixture.Context.Categories.ToListAsync(cancellationToken);
            if (!expectedCategory.Any())
            {
                var categories = GetPreconfiguredCategory();

                var enumerable = categories.ToList();
                await _catalogContextFixture.Context.Categories.AddRangeAsync(enumerable,
                    cancellationToken);
                await _catalogContextFixture.Context.SaveChangesAsync(cancellationToken);
            }

            expectedCategory = await _catalogContextFixture.Context.Categories.ToListAsync(cancellationToken);
            return expectedCategory;
        }

        private IEnumerable<Category> GetPreconfiguredCategory()
        {
            return new List<Category>
            {
                new Category {Name = "Microsoft", Description = "None", ImageName = "Microsoft.png",ImageUrl = "TestUrl"},
                new Category {Name = "Asus", Description = "None", ImageName = "Asus.png",ImageUrl = "TestUrl"},
                new Category {Name = "Apple", Description = "None", ImageName = "Apple.png",ImageUrl = "TestUrl"},
                new Category {Name = "Google", Description = "None", ImageName = "Google.png",ImageUrl = "TestUrl"},
                new Category {Name = "Docker", Description = "None", ImageName = "Docker.png",ImageUrl = "TestUrl"},
                new Category {Name = "Sony", Description = "None", ImageName = "Sony.png",ImageUrl = "TestUrl"}
            };
        }

        private Category GetTestCategoryEmptyImage()
        {
            return new Category()
            {
                Description = "Test",
                ImageUrl = "",
                ImageName = "",
                Name = "Test Category"
            };
        }

        #endregion

        #region Get

        [Fact]
        public async Task Get_Category_by_id_response_bad_request_with_message_when_id_less_or_equals_zero()
        {
            var id = 0;
            var cancellationToken = new CancellationToken();

            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.GetCategoryByIdAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Get_Category_by_id_response_not_found_when_item_not_exists()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedCategory = await _catalogContextFixture.Context.Categories.ToListAsync(cancellationToken);

            if (expectedCategory.IsNullOrEmpty())
            {
                expectedCategory = await SeedCategory(cancellationToken);
            }
            Assert.NotEmpty(expectedCategory);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedCategory.LastOrDefault().ImageId++;

            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.GetCategoryByIdAsync(id, cancellationToken);
            Assert.IsType<NotFoundResult>(response);
        }

        [Fact]
        public async Task Get_Category_image_by_id_response_bad_request_with_message_when_id_less_or_equals_zero()
        {
            var id = 0;
            var cancellationToken = new CancellationToken();

            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.GetCategoryImageAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Get_Category_image_by_id_response_not_found_when_item_not_exists()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedCategory = await _catalogContextFixture.Context.Categories.ToListAsync(cancellationToken);

            if (expectedCategory.IsNullOrEmpty())
            {
                expectedCategory = await SeedCategory(cancellationToken);
            }

            Assert.NotEmpty(expectedCategory);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedCategory.LastOrDefault().ImageId++;

            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.GetCategoryImageAsync(id, cancellationToken);
            Assert.IsType<NotFoundResult>(response);
        }

        [Fact]
        public async Task Get_category_list_response_bad_request_with_message_when_pagination_index_is_negative_or_page_size_zero_or_negative()
        {
            var cancellationToken = new CancellationToken();

            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.GetListCategoriesAsync(cancellationToken, 0, -10);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }
        #endregion

        #region Post
        [Fact]
        public async Task Post_Category_response_bad_request_with_message_when_Category_null()
        {
            var cancellationToken = new CancellationToken();

            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.AddNewCategoryAsync(null, cancellationToken);
            var badRequestResponse = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", badRequestResponse.Value.ToString());
        }
        [Fact]
        public async Task Post_Category_response_bad_request_with_message_when_Category_image_is_empty()
        {
            var cancellationToken = new CancellationToken();
            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.AddNewCategoryAsync(GetTestCategoryEmptyImage(), cancellationToken);
            var badRequestResponse = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", badRequestResponse.Value.ToString());
        }
        [Fact]
        public async Task Post_Category_response_bad_request_with_message_when_Category_exists()
        {
            var cancellationToken = new CancellationToken();
            //Arrange
            var expectedCategory = await _catalogContextFixture.Context.Categories.ToListAsync(cancellationToken);

            if (expectedCategory.IsNullOrEmpty())
            {
                expectedCategory = await SeedCategory(cancellationToken);
            }

            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.AddNewCategoryAsync(expectedCategory[0], cancellationToken);
            var badRequestResponse = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", badRequestResponse.Value.ToString());
        }

        #endregion

        #region Put

        [Fact]
        public async Task Update_Category_response_not_found_with_message_when_item_not_exists()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedCategory = await _catalogContextFixture.Context.Categories.ToListAsync(cancellationToken);

            if (expectedCategory.IsNullOrEmpty())
            {
                expectedCategory = await SeedCategory(cancellationToken);
            }

            Assert.NotEmpty(expectedCategory);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedCategory.LastOrDefault().ImageId++;

            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                    _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.UpdateCategoryAsync(id, expectedCategory[0], cancellationToken);
            var responseMessage = Assert.IsType<NotFoundObjectResult>(response);

            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Update_Category_response_bad_request_with_message_when_item_image_url_or_image_name_is_not_provided()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedCategory = await _catalogContextFixture.Context.Categories.ToListAsync(cancellationToken);

            if (expectedCategory.IsNullOrEmpty())
            {
                expectedCategory = await SeedCategory(cancellationToken);
            }

            Assert.NotEmpty(expectedCategory);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedCategory[0].ImageId;
            expectedCategory[0].ImageName = "";
            expectedCategory[0].ImageUrl = "";
            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.UpdateCategoryAsync(id, expectedCategory[0], cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);

            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        #endregion

        #region Delete

        [Fact]
        public async Task Delete_Category_response_bad_request_with_message_when_Category_hooked_with_product()
        {
            var cancellationToken = new CancellationToken();

            var expectedCategory = await _catalogContextFixture.Context.Categories.ToListAsync(cancellationToken);

            if (expectedCategory.IsNullOrEmpty())
            {
                expectedCategory = await SeedCategory(cancellationToken);
            }
            Assert.NotEmpty(expectedCategory);

            var id = (await _catalogContextFixture.Context.Categories.FirstOrDefaultAsync()).ImageId;
            
            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.DeleteCategoryAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Delete_Category_response_bad_request_with_message_when_id_less_or_equals_zero()
        {
            var id = 0;
            var cancellationToken = new CancellationToken();

            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.DeleteCategoryAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Delete_Category_response_not_found_with_message_when_item_not_found()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedCategory = await _catalogContextFixture.Context.Categories.ToListAsync(cancellationToken);

            if (expectedCategory.IsNullOrEmpty())
            {
                expectedCategory = await SeedCategory(cancellationToken);
            }

            Assert.NotEmpty(expectedCategory);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedCategory.LastOrDefault().ImageId++;

            // Act
            var categoryController = new CategoryController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await categoryController.DeleteCategoryAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<NotFoundObjectResult>(response);

            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        #endregion
    }
}