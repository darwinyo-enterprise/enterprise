using System.Collections.Generic;
using System.IO;
using System.Linq;
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

namespace Enterprise.Commerce.IntegrationTests.Catalog.API
{
    public class CatalogScenarioBase
    {
        public TestServer CreateServer()
        {
            var dict = new Dictionary<string, string>
            {
                {
                    "ConnectionString",
                    "Server=tcp:127.0.0.1,5433;Initial Catalog=Enterprise.Commerce.Services.CatalogDb;User Id=sa;Password=P@ssw0rd"
                },
                {"UseCustomizationData", "true"},
                {"AzureServiceBusEnabled", "false"},
                {"AzureStorageEnabled", "false"},
                {"EventBusConnection", "localhost"},
                {"SubscriptionClientName", "Catalog"},
                {"EventBusRetryCount", "5"},
                {"ManufacturerImageBaseUrl", "http,//localhost,5101/api/v1/manufacturer/image/"},
                {"ProductImageBaseUrl", "http,//localhost,5101/api/v1/product/image/"},
                {"CategoryImageBaseUrl", "http,//localhost,5101/api/v1/category/image/"}
            };

            var dir = Directory.GetCurrentDirectory();
            var webHostBuilder = WebHost.CreateDefaultBuilder()
                .UseContentRoot(Directory.GetCurrentDirectory() + "\\Services\\Catalog.API")
                .UseWebRoot("Pic")
                .UseConfiguration(new ConfigurationBuilder()
                    .AddInMemoryCollection(dict)
                    //.AddJsonFile(Directory.GetCurrentDirectory() + "\\Services\\Catalog.API\\appsettings.json")
                    .Build()
                )
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
            private const int PageIndex = 0;
            private const int PageCount = 4;

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

            #endregion

            #region Product

            public static string PaginatedItem()
            {
                return "api/v1/product" + Paginated(PageIndex, PageCount);
            }

            public static string ItemById(int id)
            {
                return $"api/v1/product/{id}";
            }

            public static string ItemByName(string name, bool paginated = false)
            {
                return paginated
                    ? $"api/v1/product/query/{name}" + Paginated(PageIndex, PageCount)
                    : $"api/v1/product/query/{name}";
            }

            public static string Filtered(int manufacturerId, int categoryId, bool paginated = false)
            {
                return paginated
                    ? $"api/v1/product/query/category/{categoryId}/manufacturer/{manufacturerId}" +
                      Paginated(PageIndex, PageCount)
                    : $"api/v1/product/query/category/{categoryId}/manufacturer/{manufacturerId}";
            }

            private static string Paginated(int pageIndex, int pageCount)
            {
                return $"?pageIndex={pageIndex}&pageSize={pageCount}";
            }

            public static string ImageByProductImageId(string productImageId)
            {
                return $"api/v1/product/image/{productImageId}";
            }

            #endregion
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

            public static string UpdateProduct(int id)
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