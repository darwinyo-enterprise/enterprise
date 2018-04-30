using System.Collections.Generic;
using Enterprise.Library.EventBus.Events;

namespace Catalog.API.IntegrationEvents.Events
{
    public class OrderStatusChangedToAwaitingValidationIntegrationEvent : IntegrationEvent
    {
        public OrderStatusChangedToAwaitingValidationIntegrationEvent(int orderId,
            IEnumerable<OrderStockItem> orderStockItems)
        {
            OrderId = orderId;
            OrderStockItems = orderStockItems;
        }

        public int OrderId { get; }
        public IEnumerable<OrderStockItem> OrderStockItems { get; }
    }

    public class OrderStockItem
    {
        public OrderStockItem(int productId, int units)
        {
            ProductId = productId;
            Units = units;
        }

        public int ProductId { get; }
        public int Units { get; }
    }
}