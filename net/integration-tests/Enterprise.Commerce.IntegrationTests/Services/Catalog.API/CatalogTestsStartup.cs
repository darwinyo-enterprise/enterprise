using System;
using System.Collections.Generic;
using System.Text;
using Catalog.API;
using Enterprise.Commerce.IntegrationTests.Middlewares;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;

namespace Enterprise.Commerce.IntegrationTests.Services.Catalog.API
{
    public class CatalogTestsStartup:Startup
    {
        public CatalogTestsStartup(IConfiguration env) : base(env)
        {
        }

        protected override void ConfigureAuth(IApplicationBuilder app)
        {
            if (Configuration["isTest"] == bool.TrueString.ToLowerInvariant())
            {
                app.UseMiddleware<AutoAuthorizeMiddleware>();
            }
            else
            {
                base.ConfigureAuth(app);
            }
        }
    }
}
