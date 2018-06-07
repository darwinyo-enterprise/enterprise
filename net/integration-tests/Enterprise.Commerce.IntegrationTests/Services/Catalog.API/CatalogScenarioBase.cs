using System.IO;
using Catalog.API;
using Catalog.API.Infrastructure;
using Enterprise.Library.IntegrationEventLog;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Enterprise.Commerce.IntegrationTests.Services.Catalog.API
{
    public class CatalogScenarioBase
    {
        public TestServer CreateServer()
        {
            var webHostBuilder = WebHost.CreateDefaultBuilder()
                .UseContentRoot(Directory.GetCurrentDirectory() + "/Services/Catalog.API")
                .UseWebRoot("Pic")
                .UseConfiguration(new ConfigurationBuilder()
                    .AddJsonFile(Directory.GetCurrentDirectory() + "/Services/Catalog.API/appsettings.json")
                    .Build()
                )
                .ConfigureAppConfiguration((builderContext, config) => { config.AddEnvironmentVariables(); })
                .UseStartup<Startup>();

            var testServer = new TestServer(webHostBuilder);

            testServer.Host
                .MigrateDbContext<CatalogContext>((context, services) =>
                {
                    var env = services.GetService<IHostingEnvironment>();
                    var settings = services.GetService<IOptions<CatalogSettings>>();
                    var logger = services.GetService<ILogger<CatalogContextSeed>>();

                    new CatalogContextSeed()
                        .SeedAsync(context, env, settings, logger)
                        .Wait();
                })
                .MigrateDbContext<IntegrationEventLogContext>((_, __) => { });

            return testServer;
        }

        public static class Get
        {
            public const int PageSize = 10;
            public const int PageIndex = 0;

            #region Manufacturer

            public static string Manufacturers = "api/v1/manufacturer";

            public static string ManufacturerById(int manufacturerId)
            {
                return "api/v1/manufacturer/" + manufacturerId;
            }

            public static string ManufacturerImageById(string manufacturerId)
            {
                return "api/v1/manufacturer/image/" + manufacturerId;
            }

            public static string ManufacturerListPaginatedItem()
            {
                return "api/v1/manufacturer/list" + Paginated(PageIndex, PageSize);
            }
            public static string ManufacturerPaginatedItem()
            {
                return "api/v1/manufacturer/paginated" + Paginated(PageIndex, PageSize);
            }
            #endregion

            #region Category

            public static string Categories = "api/v1/category";

            public static string CategoryById(string categoryId)
            {
                return "api/v1/category/" + categoryId;
            }

            public static string CategoryImageById(string categoryId)
            {
                return "api/v1/category/image" + categoryId;
            }
            public static string CategoryListPaginatedItem()
            {
                return "api/v1/category/list" + Paginated(PageIndex, PageSize);
            }
            public static string CategoryPaginatedItem()
            {
                return "api/v1/category/paginated" + Paginated(PageIndex, PageSize);
            }
            #endregion

            #region Product

            public static string ProductPaginatedItem()
            {
                return "api/v1/product" + Paginated(PageIndex, PageSize);
            }
            public static string HotProductPaginatedItem()
            {
                return "api/v1/product/hot" + Paginated(PageIndex, PageSize);
            }
            public static string LatestProductPaginatedItem()
            {
                return "api/v1/product/latest" + Paginated(PageIndex, PageSize);
            }
            public static string ProductListPaginatedItem()
            {
                return "api/v1/product/list" + Paginated(PageIndex, PageSize);
            }

            public static string ItemById(string id)
            {
                return $"api/v1/product/{id}";
            }

            public static string ItemByName(string name, bool paginated = false)
            {
                return paginated
                    ? $"api/v1/product/query/{name}" + Paginated(PageIndex, PageSize)
                    : $"api/v1/product/query/{name}";
            }

            public static string Filtered(int manufacturerId, int categoryId, bool paginated = false)
            {
                return paginated
                    ? $"api/v1/product/query/category/{categoryId}/manufacturer/{manufacturerId}" +
                      Paginated(PageIndex, PageSize)
                    : $"api/v1/product/query/category/{categoryId}/manufacturer/{manufacturerId}";
            }

            public static string ImageByProductImageId(string productImageId)
            {
                return $"api/v1/product/image/{productImageId}";
            }

            #endregion

            private static string Paginated(int pageIndex, int pageCount)
            {
                return $"?pageIndex={pageIndex}&pageSize={pageCount}";
            }
        }

        public static class Post
        {
            #region Manufacturer

            public static string AddManufacturer => $"api/v1/manufacturer";

            #endregion

            #region Category

            public static string AddCategory => $"api/v1/category";

            #endregion

            #region Product

            public static string AddRate => $"api/v1/product/rate";
            public static string AddProduct => $"api/v1/product";

            #endregion
        }

        public static class Put
        {
            #region Manufacturer

            public static string UpdateManufacturer(int id)
            {
                return $"api/v1/manufacturer/{id}";
            }

            #endregion

            #region Category

            public static string UpdateCategory(int id)
            {
                return $"api/v1/category/{id}";
            }

            #endregion

            #region Product

            public static string UpdateInventory(string id, int amount)
            {
                return $"api/v1/product/inventory?id={id}&amount={amount}";
            }

            public static string UpdateProduct(string id)
            {
                return $"api/v1/product/{id}";
            }

            #endregion
        }

        public static class Delete
        {
            #region Manufacturer

            public static string DeleteManufacturer(int id)
            {
                return $"api/v1/manufacturer/{id}";
            }
            #endregion

            #region Category

            public static string DeleteCategory(int id)
            {
                return $"api/v1/category/{id}";
            }
            #endregion

            #region Product

            public static string DeleteProduct(string id)
            {
                return $"api/v1/product/{id}";
            }
            #endregion
        }
    }
}