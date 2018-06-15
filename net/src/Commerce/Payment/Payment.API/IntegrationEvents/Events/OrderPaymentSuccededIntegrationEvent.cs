using Enterprise.Library.EventBus.Events;

namespace Payment.API.IntegrationEvents.Events
{
    public class OrderPaymentSuccededIntegrationEvent : IntegrationEvent
    {
        public int OrderId { get; }

        public OrderPaymentSuccededIntegrationEvent(int orderId) => OrderId = orderId;
    }
}