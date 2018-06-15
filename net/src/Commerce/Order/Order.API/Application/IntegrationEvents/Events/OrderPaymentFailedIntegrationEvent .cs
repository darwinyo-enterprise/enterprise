using Enterprise.Library.EventBus.Events;

namespace Order.API.Application.IntegrationEvents.Events
{
    public class OrderPaymentFailedIntegrationEvent : IntegrationEvent
    {
        public int OrderId { get; }

        public OrderPaymentFailedIntegrationEvent(int orderId) => OrderId = orderId;
    }
}