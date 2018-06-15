using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Enterprise.Commerce.IntegrationTests.Middlewares
{
    public class AutoAuthorizeMiddleware
    {
        private readonly RequestDelegate _next;

        public AutoAuthorizeMiddleware(RequestDelegate rd)
        {
            _next = rd;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            var identity = new ClaimsIdentity("cookies");
            identity.AddClaim(new Claim("sub", "1234"));
            identity.AddClaim(new Claim("roles", "Admin"));
            identity.AddClaim(new Claim("roles", "End User"));
            httpContext.User.AddIdentity(identity);
            await _next.Invoke(httpContext);
        }
    }
}