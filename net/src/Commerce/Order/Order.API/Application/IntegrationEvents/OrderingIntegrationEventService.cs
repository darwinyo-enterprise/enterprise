﻿using System;
using System.Data.Common;
using System.Threading.Tasks;
using Enterprise.Library.EventBus.Abstractions;
using Enterprise.Library.EventBus.Events;
using Enterprise.Library.IntegrationEventLog.Services;
using Enterprise.Library.IntegrationEventLog.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Order.Infrastructure;

namespace Order.API.Application.IntegrationEvents
{
    public class OrderingIntegrationEventService : IOrderingIntegrationEventService
    {
        private readonly IEventBus _eventBus;
        private readonly IIntegrationEventLogService _eventLogService;
        private readonly Func<DbConnection, IIntegrationEventLogService> _integrationEventLogServiceFactory;
        private readonly OrderingContext _orderingContext;

        public OrderingIntegrationEventService(IEventBus eventBus, OrderingContext orderingContext,
            Func<DbConnection, IIntegrationEventLogService> integrationEventLogServiceFactory)
        {
            _orderingContext = orderingContext ?? throw new ArgumentNullException(nameof(orderingContext));
            _integrationEventLogServiceFactory = integrationEventLogServiceFactory ??
                                                 throw new ArgumentNullException(
                                                     nameof(integrationEventLogServiceFactory));
            _eventBus = eventBus ?? throw new ArgumentNullException(nameof(eventBus));
            _eventLogService = _integrationEventLogServiceFactory(_orderingContext.Database.GetDbConnection());
        }

        public async Task PublishThroughEventBusAsync(int orderId, string orderStatus, IntegrationEvent evt)
        {
            await SaveEventAndOrderingContextChangesAsync(orderId, orderStatus, evt);
            _eventBus.Publish(evt);
            await _eventLogService.MarkEventAsPublishedAsync(evt);
        }

        private async Task SaveEventAndOrderingContextChangesAsync(int orderId, string orderStatus, IntegrationEvent evt)
        {
            //Use of an EF Core resiliency strategy when using multiple DbContexts within an explicit BeginTransaction():
            //See: https://docs.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency            
            await ResilientTransaction.New(_orderingContext)
                .ExecuteAsync(async () =>
                {
                    // Achieving atomicity between original Ordering database operation and the IntegrationEventLog thanks to a local transaction
                    await _orderingContext.SaveChangesAsync();
                    await _eventLogService.SaveEventAsync(orderId,orderStatus, evt,
                        _orderingContext.Database.CurrentTransaction.GetDbTransaction());
                });
        }
    }
}