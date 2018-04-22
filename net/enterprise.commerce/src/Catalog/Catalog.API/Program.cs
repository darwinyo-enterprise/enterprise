using System.IO;
using Enterprise.Library.HealthChecks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Catalog.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args)
                //.MigrateDbContext<CatalogContext>((context, services) =>
                //{
                //    var env = services.GetService<IHostingEnvironment>();
                //    var settings = services.GetService<IOptions<CatalogSettings>>();
                //    var logger = services.GetService<ILogger<CatalogContextSeed>>();

                //    new CatalogContextSeed()
                //        .SeedAsync(context, env, settings, logger)
                //        .Wait();

                //})
                //.MigrateDbContext<IntegrationEventLogContext>((_, __) => { })
                .Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseApplicationInsights()
                .UseHealthChecks("/hc")
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseWebRoot("Pic")
                .ConfigureAppConfiguration((builderContext, config) => { config.AddEnvironmentVariables(); })
                .ConfigureLogging((hostingContext, builder) =>
                {
                    builder.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                    builder.AddConsole();
                    builder.AddDebug();
                })
                .Build();
        }
    }
}