using Enterprise.Library.EventBus.Events;

namespace Order.API.Application.IntegrationEvents.Events
{
    // Integration Events notes: 
    // An Event is “something that has happened in the past”, therefore its name has to be   
    // An Integration Event is an event that can cause side effects to other microsrvices, Bounded-Contexts or external systems.
    public class OrderStartedIntegrationEvent : IntegrationEvent
    {
        public OrderStartedIntegrationEvent(string userId)
            => UserId = userId;

        public string UserId { get; set; }
    }
}