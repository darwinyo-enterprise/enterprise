using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;

namespace Enterprise.Extensions.HealthChecks
{
    public static class HealthCheckServiceCollectionExtensions
    {
        private static readonly Type HealthCheckServiceInterface = typeof(IHealthCheckService);

        public static IServiceCollection AddHealthChecks(this IServiceCollection services,
            Action<HealthCheckBuilder> checks)
        {
            Guard.OperationValid(services.All(descriptor => descriptor.ServiceType != HealthCheckServiceInterface),
                "AddHealthChecks may only be called once.");

            var builder = new HealthCheckBuilder();

            services.AddSingleton<IHealthCheckService, HealthCheckService>(serviceProvider =>
            {
                var serviceScopeFactory = serviceProvider.GetService<IServiceScopeFactory>();
                return new HealthCheckService(builder, serviceProvider, serviceScopeFactory);
            });

            checks(builder);
            return services;
        }
    }
}