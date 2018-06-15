using System.Collections.Generic;
using Enterprise.Library.EventBus.Events;

namespace Order.API.Application.IntegrationEvents.Events
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
        public ConfirmedOrderStockItem(int productId, bool hasStock)
        {
            ProductId = productId;
            HasStock = hasStock;
        }

        public int ProductId { get; }
        public bool HasStock { get; }
    }
}