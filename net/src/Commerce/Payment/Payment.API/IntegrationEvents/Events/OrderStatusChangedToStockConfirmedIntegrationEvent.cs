using Enterprise.Library.EventBus.Events;

namespace Payment.API.IntegrationEvents.Events
{
    public class OrderStatusChangedToStockConfirmedIntegrationEvent : IntegrationEvent
    {
        public OrderStatusChangedToStockConfirmedIntegrationEvent(int orderId)
        {
            OrderId = orderId;
        }

        public int OrderId { get; }
    }
}