using MediatR;

namespace Order.Domain.Events
{
    public class OrderCancelledDomainEvent : INotification
    {
        public OrderCancelledDomainEvent(AggregatesModel.OrderAggregate.Order order)
        {
            Order = order;
        }

        public AggregatesModel.OrderAggregate.Order Order { get; }
    }
}