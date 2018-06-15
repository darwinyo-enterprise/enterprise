using Enterprise.Library.EventBus.Events;

namespace Payment.API.IntegrationEvents.Events
{
    public class OrderPaymentFailedIntegrationEvent : IntegrationEvent
    {
        public OrderPaymentFailedIntegrationEvent(int orderId) => OrderId = orderId;
        public int OrderId { get; }
    }
}