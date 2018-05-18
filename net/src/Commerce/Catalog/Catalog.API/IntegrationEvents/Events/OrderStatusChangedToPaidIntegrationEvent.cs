using System.Collections.Generic;
using Enterprise.Library.EventBus.Events;

namespace Catalog.API.IntegrationEvents.Events
{
    public class OrderStatusChangedToPaidIntegrationEvent : IntegrationEvent
    {
        public OrderStatusChangedToPaidIntegrationEvent(int orderId,
            IEnumerable<OrderStockItem> orderStockItems)
        {
            OrderId = orderId;
            OrderStockItems = orderStockItems;
        }

        public int OrderId { get; }
        public IEnumerable<OrderStockItem> OrderStockItems { get; }
    }
}