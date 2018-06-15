using Enterprise.Library.EventBus.Events;

namespace Order.API.Application.IntegrationEvents.Events
{
    public class GracePeriodConfirmedIntegrationEvent : IntegrationEvent
    {
        public GracePeriodConfirmedIntegrationEvent(int orderId)
        {
            OrderId = orderId;
        }

        public int OrderId { get; }
    }
}