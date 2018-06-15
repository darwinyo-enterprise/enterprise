using System.Collections.Generic;
using Enterprise.Library.EventBus.Events;

namespace Order.API.Application.IntegrationEvents.Events
{
    public class OrderStatusChangedToPaidIntegrationEvent : IntegrationEvent
    {
        public OrderStatusChangedToPaidIntegrationEvent(int orderId,
            string orderStatus,
            string buyerName,
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
}