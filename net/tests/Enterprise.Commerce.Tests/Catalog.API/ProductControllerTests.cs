using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Catalog.API;
using Catalog.API.Controllers;
using Catalog.API.Models;
using Catalog.API.ViewModels;
using Enterprise.Commerce.IntegrationTests.Fixture;
using Enterprise.Commerce.Tests.Fixture;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace Enterprise.Commerce.Tests.Catalog.API
{
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

        private async Task<List<Product>> SeedProduct(CancellationToken cancellationToken)
        {
            var expectedManufacturer =
                await _catalogContextFixture.Context.Manufacturers.ToListAsync(cancellationToken);
            if (!expectedManufacturer.Any())
            {
                var manufacturer = GetPreconfigureManufacturer();

                var enumerable = manufacturer;
                if (enumerable != null)
                    await _catalogContextFixture.Context.Manufacturers.AddRangeAsync(
                        enumerable,
                        cancellationToken);
                await _catalogContextFixture.Context.SaveChangesAsync(cancellationToken);
            }

            var expectedCategory =
                await _catalogContextFixture.Context.Categories.ToListAsync(cancellationToken);
            if (!expectedCategory.Any())
            {
                var manufacturer = GetPreconfigureCategory();

                var enumerable = manufacturer;
                if (enumerable != null)
                    await _catalogContextFixture.Context.Categories.AddRangeAsync(
                        enumerable,
                        cancellationToken);
                await _catalogContextFixture.Context.SaveChangesAsync(cancellationToken);
            }

            var expectedProduct =
                await _catalogContextFixture.Context.Products.ToListAsync(cancellationToken);
            if (!expectedProduct.Any())
            {
                var products = GetPreconfiguredProduct();

                var enumerable = products.ToList();
                await _catalogContextFixture.Context.Products.AddRangeAsync(enumerable,
                    cancellationToken);
                await _catalogContextFixture.Context.SaveChangesAsync(cancellationToken);
            }

            expectedProduct = await _catalogContextFixture.Context.Products.ToListAsync(cancellationToken);

            foreach (var product in expectedProduct)
            {
                var expectedProductImage =
                    await _catalogContextFixture.Context.ProductImages.ToListAsync(cancellationToken);
                if (expectedProductImage.All(x => x.ProductId != product.Id))
                {
                    var productImages = GetPreconfiguredProductImage(product.Id);

                    var enumerable = productImages.ToList();
                    await _catalogContextFixture.Context.ProductImages.AddRangeAsync(enumerable,
                        cancellationToken);
                    await _catalogContextFixture.Context.SaveChangesAsync(cancellationToken);
                }

                var expectedProductColor =
                    await _catalogContextFixture.Context.ProductColors.ToListAsync(cancellationToken);
                if (expectedProductColor.All(x => x.ProductId != product.Id))
                {
                    var productColors = GetPreconfigureProductColor(product.Id);

                    var enumerable = productColors.ToList();
                    await _catalogContextFixture.Context.ProductColors.AddRangeAsync(enumerable,
                        cancellationToken);
                    await _catalogContextFixture.Context.SaveChangesAsync(cancellationToken);
                }
            }

            return expectedProduct;
        }

        private IEnumerable<Product> GetPreconfiguredProduct()
        {
            var products = new List<Product>()
            {
                new Product()
                {
                    Id = "1",
                    AvailableStock = 1,
                    CategoryId = _catalogContextFixture.Context.Categories.First().Id,
                    Description = "Test",
                    ManufacturerId = _catalogContextFixture.Context.Manufacturers.First().Id,
                    Name = "product1",
                    Price = 100,
                    OverallRating = 0,
                    TotalFavorites = 0,
                    TotalReviews = 0,
                },
                new Product()
                {
                    Id = "2",
                    AvailableStock = 1,
                    CategoryId = _catalogContextFixture.Context.Categories.First().Id,
                    Description = "Test",
                    ManufacturerId = _catalogContextFixture.Context.Manufacturers.First().Id,
                    Name = "product2",
                    Price = 100,
                    OverallRating = 0,
                    TotalFavorites = 0,
                    TotalReviews = 0,
                }
            };
            return products;
        }

        private IEnumerable<Manufacturer> GetPreconfigureManufacturer()
        {
            var manufacturers = new List<Manufacturer>
            {
                new Manufacturer()
                {
                    Name = "manufacturer1",
                    Description = "test",
                    ImageName = "Test.png"
                }
            };
            return manufacturers;
        }

        private IEnumerable<Category> GetPreconfigureCategory()
        {
            var categories = new List<Category>
            {
                new Category()
                {
                    Name = "category1",
                    Description = "test",
                    ImageName = "Test.png"
                }
            };
            return categories;
        }

        private IEnumerable<ProductImage> GetPreconfiguredProductImage(string productId)
        {
            return new List<ProductImage>()
            {
                new ProductImage()
                {
                    ImageName = "image1",
                    ImageUrl = "image.png",
                    ProductId = productId
                },
                new ProductImage()
                {
                    ImageName = "image2",
                    ImageUrl = "image.png",
                    ProductId = productId
                },
                new ProductImage()
                {
                    ImageName = "image3",
                    ImageUrl = "image.png",
                    ProductId = productId
                },
                new ProductImage()
                {
                    ImageName = "image4",
                    ImageUrl = "image.png",
                    ProductId = productId
                }
            };
        }

        private IEnumerable<ProductColor> GetPreconfigureProductColor(string productId)
        {
            return new List<ProductColor>()
            {
                new ProductColor()
                {
                    Name = "Color1",
                    ProductId = productId
                },
                new ProductColor()
                {
                    Name = "Color2",
                    ProductId = productId
                }
            };
        }

        private ProductViewModel GetTestProductViewModelEmptyImage()
        {
            return new ProductViewModel()
            {
                Description = "Test",
                Name = "Test Product",
                CategoryId = 1,
                Id = Guid.NewGuid().ToString(),
                ManufacturerId = 1,
                Price = 1231,
                ActorId = "1",
                ProductImages = new ProductImage[1],
                ProductColors = new ProductColor[1]
            };
        }

        /// <summary>
        ///     GET:
        ///     Product Id => ok
        ///     Paginated Product List => ok
        ///     Prouct Image => ok
        ///     TODO: Pagination tests
        ///     GetPaginatedCatalogAsync
        ///     GetPaginatedCatalogByNameAsync
        ///     GetPaginatedCatalogByCategoryOrManufacturerAsync
        /// </summary>
        /// <returns></returns>

        #region Get
        [Fact]
        public async Task Get_product_info_by_id_response_bad_request_with_message_when_id_null_or_empty()
        {
            var id = "";
            var cancellationToken = new CancellationToken();

            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.GetProductInfoByIdAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Get_product_info_by_id_response_not_found_when_item_not_exists()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedProduct = await _catalogContextFixture.Context.Products.ToListAsync(cancellationToken);

            if (expectedProduct.IsNullOrEmpty())
            {
                expectedProduct = await SeedProduct(cancellationToken);
            }

            Assert.NotEmpty(expectedProduct);

            var id = expectedProduct.LastOrDefault()?.Id + "z";

            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.GetProductInfoByIdAsync(id, cancellationToken);
            Assert.IsType<NotFoundResult>(response);
        }

        [Fact]
        public async Task Get_product_by_id_response_bad_request_with_message_when_id_null_or_empty()
        {
            var id = "";
            var cancellationToken = new CancellationToken();

            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.GetProductByIdAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Get_product_by_id_response_not_found_when_item_not_exists()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedProduct = await _catalogContextFixture.Context.Products.ToListAsync(cancellationToken);

            if (expectedProduct.IsNullOrEmpty())
            {
                expectedProduct = await SeedProduct(cancellationToken);
            }

            Assert.NotEmpty(expectedProduct);

            var id = expectedProduct.LastOrDefault()?.Id + "z";

            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.GetProductByIdAsync(id, cancellationToken);
            Assert.IsType<NotFoundResult>(response);
        }

        [Fact]
        public async Task Get_product_image_by_id_response_bad_request_with_message_when_id_less_or_equals_zero()
        {
            var id = 0;
            var cancellationToken = new CancellationToken();

            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.GetProductImageAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Get_product_image_by_id_response_not_found_when_item_not_exists()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedProduct = await _catalogContextFixture.Context.Products.ToListAsync(cancellationToken);

            if (expectedProduct.IsNullOrEmpty())
            {
                expectedProduct = await SeedProduct(cancellationToken);
            }

            Assert.NotEmpty(expectedProduct);

            var lastProduct = expectedProduct.LastOrDefault();
            var lastProductImageId = lastProduct?.ProductImages.LastOrDefault()?.Id + 1;

            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            if (lastProductImageId != null)
            {
                var response =
                    await productController.GetProductImageAsync(lastProductImageId.Value, cancellationToken);
                Assert.IsType<NotFoundResult>(response);
            }
            else
            {
                throw new Exception("Product Image Null");
            }
        }

        [Fact]
        public async Task
            Get_product_list_response_bad_request_with_message_when_pagination_index_is_negative_or_page_size_zero_or_negative()
        {
            var cancellationToken = new CancellationToken();

            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.GetListProductsAsync(cancellationToken, 0, -10);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        #endregion

        /// <summary>
        ///     POST :
        ///     AddNewProductAsync => Ok
        ///     TODO :
        ///     RateProductAsync
        /// </summary>
        /// <returns></returns>

        #region Post
        [Fact]
        public async Task Post_product_response_bad_request_with_message_when_product_null()
        {
            var cancellationToken = new CancellationToken();

            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.AddNewProductAsync(null, cancellationToken);
            var badRequestResponse = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", badRequestResponse.Value.ToString());
        }

        [Fact]
        public async Task Post_product_response_bad_request_with_message_when_product_image_is_empty()
        {
            var cancellationToken = new CancellationToken();
            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response =
                await productController.AddNewProductAsync(GetTestProductViewModelEmptyImage(), cancellationToken);
            var badRequestResponse = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", badRequestResponse.Value.ToString());
        }

        [Fact]
        public async Task Post_product_response_bad_request_with_message_when_product_has_no_category_or_manufacturer()
        {
            var cancellationToken = new CancellationToken();
            //Arrange

            var productViewModel = new ProductViewModel()
            {
                CategoryId = 0,
                ManufacturerId = 0,
                ProductImages = new ProductImage[1]
                {
                    new ProductImage()
                    {
                        Id = 1,
                        ImageName = "test"
                    }
                }
            };
            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.AddNewProductAsync(productViewModel, cancellationToken);
            var badRequestResponse = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", badRequestResponse.Value.ToString());
        }

        [Fact]
        public async Task Post_product_response_bad_request_with_message_when_product_exists()
        {
            var cancellationToken = new CancellationToken();
            //Arrange
            var expectedProduct = await _catalogContextFixture.Context.Products.ToListAsync(cancellationToken);

            if (expectedProduct.IsNullOrEmpty())
            {
                expectedProduct = await SeedProduct(cancellationToken);
            }

            var productToAdd = new ProductViewModel()
            {
                ProductImages = GetPreconfiguredProductImage(expectedProduct.First().Id).ToArray(),
                Name = expectedProduct.First().Name,
                CategoryId = expectedProduct.First().CategoryId,
                ManufacturerId = expectedProduct.First().ManufacturerId
            };
            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.AddNewProductAsync(productToAdd, cancellationToken);
            var badRequestResponse = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", badRequestResponse.Value.ToString());
        }

        #endregion

        /// <summary>
        ///     PUT :
        ///     UpdateProductAsync => ok
        ///     TODO :
        ///     UpdateInventoryAsync
        /// </summary>
        /// <returns></returns>

        #region Put
        [Fact]
        public async Task Update_product_response_not_found_with_message_when_item_not_exists()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedProduct = await _catalogContextFixture.Context.Products.ToListAsync(cancellationToken);

            if (expectedProduct.IsNullOrEmpty())
            {
                expectedProduct = await SeedProduct(cancellationToken);
            }

            Assert.NotEmpty(expectedProduct);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedProduct.LastOrDefault().Id + "z";

            var productToUpdate = new ProductViewModel
            {
                ProductImages = expectedProduct.LastOrDefault().ProductImages.ToArray()
            };

            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.UpdateProductAsync(id, productToUpdate, cancellationToken);
            var responseMessage = Assert.IsType<NotFoundObjectResult>(response);

            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task
            Update_product_response_bad_request_with_message_when_product_has_no_category_or_manufacturer()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedProduct = await _catalogContextFixture.Context.Products.ToListAsync(cancellationToken);

            if (expectedProduct.IsNullOrEmpty())
            {
                expectedProduct = await SeedProduct(cancellationToken);
            }

            Assert.NotEmpty(expectedProduct);

            var productToUpdate = new ProductViewModel
            {
                Name = "Test"
            };
            // ReSharper disable once PossibleNullReferenceException
            var id = expectedProduct[0].Id;
            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.UpdateProductAsync(id, productToUpdate, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);

            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task
            Update_product_response_bad_request_with_message_when_item_image_url_or_image_name_is_not_provided()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedProduct = await _catalogContextFixture.Context.Products.ToListAsync(cancellationToken);

            if (expectedProduct.IsNullOrEmpty())
            {
                expectedProduct = await SeedProduct(cancellationToken);
            }

            Assert.NotEmpty(expectedProduct);

            var productToUpdate = new ProductViewModel
            {
                Name = "Test",
                CategoryId = expectedProduct.FirstOrDefault().CategoryId,
                ManufacturerId = expectedProduct.FirstOrDefault().ManufacturerId
            };
            // ReSharper disable once PossibleNullReferenceException
            var id = expectedProduct[0].Id;
            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.UpdateProductAsync(id, productToUpdate, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);

            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        #endregion

        /// <summary>
        ///     DELETE :
        ///     DeleteProductAsync => ok
        /// </summary>
        /// <returns></returns>

        #region Delete
        [Fact]
        public async Task Delete_product_response_bad_request_with_message_when_product_hooked_with_product()
        {
            var cancellationToken = new CancellationToken();

            var expectedProduct = await _catalogContextFixture.Context.Products.ToListAsync(cancellationToken);

            if (expectedProduct.IsNullOrEmpty())
            {
                expectedProduct = await SeedProduct(cancellationToken);
            }

            Assert.NotEmpty(expectedProduct);

            var id = (await _catalogContextFixture.Context.Products.FirstOrDefaultAsync(
                cancellationToken: cancellationToken)).Id;
            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.DeleteProductAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Delete_product_response_bad_request_with_message_when_id_empty_or_null()
        {
            var id = "";
            var cancellationToken = new CancellationToken();

            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.DeleteProductAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<BadRequestObjectResult>(response);
            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        [Fact]
        public async Task Delete_product_response_not_found_with_message_when_item_not_found()
        {
            var cancellationToken = new CancellationToken();
            // Arrange
            var expectedProduct = await _catalogContextFixture.Context.Products.ToListAsync(cancellationToken);

            if (expectedProduct.IsNullOrEmpty())
            {
                expectedProduct = await SeedProduct(cancellationToken);
            }

            Assert.NotEmpty(expectedProduct);

            // ReSharper disable once PossibleNullReferenceException
            var id = expectedProduct.LastOrDefault().Id + "z";

            // Act
            var productController = new ProductController(_catalogContextFixture.Context,
                _fileUtilityFixture.FileUtility, _settings);
            var response = await productController.DeleteProductAsync(id, cancellationToken);
            var responseMessage = Assert.IsType<NotFoundObjectResult>(response);

            Assert.Contains("Message", responseMessage.Value.ToString());
        }

        #endregion
    }
}