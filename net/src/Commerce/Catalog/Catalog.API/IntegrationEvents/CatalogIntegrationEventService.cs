using System;
using System.Data.Common;
using System.Threading.Tasks;
using Catalog.API.Infrastructure;
using Enterprise.Library.EventBus.Abstractions;
using Enterprise.Library.EventBus.Events;
using Enterprise.Library.IntegrationEventLog.Services;
using Enterprise.Library.IntegrationEventLog.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Catalog.API.IntegrationEvents
{
    public class CatalogIntegrationEventService : ICatalogIntegrationEventService
    {
        private readonly CatalogContext _catalogContext;
        private readonly IEventBus _eventBus;
        private readonly IIntegrationEventLogService _eventLogService;
        private readonly Func<DbConnection, IIntegrationEventLogService> _integrationEventLogServiceFactory;

        public CatalogIntegrationEventService(IEventBus eventBus, CatalogContext catalogContext,
            Func<DbConnection, IIntegrationEventLogService> integrationEventLogServiceFactory)
        {
            _catalogContext = catalogContext ?? throw new ArgumentNullException(nameof(catalogContext));
            _integrationEventLogServiceFactory = integrationEventLogServiceFactory ??
                                                 throw new ArgumentNullException(
                                                     nameof(integrationEventLogServiceFactory));
            _eventBus = eventBus ?? throw new ArgumentNullException(nameof(eventBus));
            _eventLogService = _integrationEventLogServiceFactory(_catalogContext.Database.GetDbConnection());
        }

        public async Task PublishThroughEventBusAsync(IntegrationEvent evt)
        {
            _eventBus.Publish(evt);

            await _eventLogService.MarkEventAsPublishedAsync(evt);
        }

        public async Task SaveEventAndCatalogContextChangesAsync(int orderId, string orderStatus, IntegrationEvent evt)
        {
            //Use of an EF Core resiliency strategy when using multiple DbContexts within an explicit BeginTransaction():
            //See: https://docs.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency            
            await ResilientTransaction.New(_catalogContext)
                .ExecuteAsync(async () =>
                {
                    // Achieving atomicity between original catalog database operation and the IntegrationEventLog thanks to a local transaction
                    await _catalogContext.SaveChangesAsync();
                    await _eventLogService.SaveEventAsync(orderId, orderStatus, evt,
                        _catalogContext.Database.CurrentTransaction.GetDbTransaction());
                });
        }
    }
}