using System.Collections.Generic;
using Enterprise.Library.EventBus.Events;

namespace Catalog.API.IntegrationEvents.Events
{
    public class OrderStockRejectedIntegrationEvent : IntegrationEvent
    {
        public OrderStockRejectedIntegrationEvent(int orderId,
            List<ConfirmedOrderStockItem> orderStockItems)
        {
            OrderId = orderId;
            OrderStockItems = orderStockItems;
        }

        public int OrderId { get; }

        public List<ConfirmedOrderStockItem> OrderStockItems { get; }
    }

    public class ConfirmedOrderStockItem
    {
        public ConfirmedOrderStockItem(string productId, bool hasStock)
        {
            ProductId = productId;
            HasStock = hasStock;
        }

        public string ProductId { get; }
        public bool HasStock { get; }
    }
}