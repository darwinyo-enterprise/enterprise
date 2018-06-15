using MediatR;

namespace Order.Domain.Events
{
    public class OrderShippedDomainEvent : INotification
    {
        public OrderShippedDomainEvent(AggregatesModel.OrderAggregate.Order order)
        {
            Order = order;
        }

        public AggregatesModel.OrderAggregate.Order Order { get; }
    }
}