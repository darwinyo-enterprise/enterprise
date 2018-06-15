using Enterprise.Library.EventBus.Events;

namespace Payment.API.IntegrationEvents.Events
{
    public class OrderPaymentSuccededIntegrationEvent : IntegrationEvent
    {
        public OrderPaymentSuccededIntegrationEvent(int orderId)
        {
            OrderId = orderId;
        }

        public int OrderId { get; }
    }
}