using System.IO;
using Catalog.API.Infrastructure;
using Enterprise.Library.IntegrationEventLog;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;

namespace Catalog.API.IntegrationTests
{
    public class CatalogScenarioBase
    {
        public TestServer CreateServer()
        {
            var webHostBuilder = WebHost.CreateDefaultBuilder();
            webHostBuilder.UseContentRoot(Directory.GetCurrentDirectory() + @"\Commerce\Catalog");
            webHostBuilder.UseStartup<Startup>();

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

            public static string ManufacturerById(string manufacturerId) => "api/v1/manufacturer/" + manufacturerId;

            public static string ManufacturerImageById(string manufacturerId) =>
                "api/v1/manufacturer/image" + manufacturerId;

            #endregion

            #region Category

            public static string Categories = "api/v1/category";

            public static string CategoryById(string categoryId) => "api/v1/category/" + categoryId;

            public static string CategoryImageById(string categoryId) =>
                "api/v1/category/image" + categoryId;

            #endregion

            #region Product

            public static string PaginatedItem() => "api/v1/product" + Paginated(PageIndex, PageCount);

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

            public static string ImageByProductImageId(string productImageId) => $"api/v1/product/image/{productImageId}";

            #endregion
        }

        public static class Post
        {

        }
    }
}