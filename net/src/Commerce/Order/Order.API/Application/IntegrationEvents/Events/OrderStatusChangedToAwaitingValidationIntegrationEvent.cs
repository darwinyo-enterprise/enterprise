using System.Collections.Generic;
using Enterprise.Library.EventBus.Events;

namespace Order.API.Application.IntegrationEvents.Events
{
    public class OrderStatusChangedToAwaitingValidationIntegrationEvent : IntegrationEvent
    {
        public OrderStatusChangedToAwaitingValidationIntegrationEvent(int orderId, string orderStatus, string buyerName,
            IEnumerable<OrderStockItem> orderStockItems)
        {
            OrderId = orderId;
            OrderStockItems = orderStockItems;
            OrderStatus = orderStatus;
            BuyerName = buyerName;
        }

        public int OrderId { get; }
        public string OrderStatus { get; }
        public string BuyerName { get; }
        public IEnumerable<OrderStockItem> OrderStockItems { get; }
    }

    public class OrderStockItem
    {
        public OrderStockItem(string productId, int units)
        {
            ProductId = productId;
            Units = units;
        }

        public string ProductId { get; }
        public int Units { get; }
    }
}