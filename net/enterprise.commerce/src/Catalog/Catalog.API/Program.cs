using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Catalog.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args: args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args: args)
                .UseStartup<Startup>()
                .Build();
        }
    }
}