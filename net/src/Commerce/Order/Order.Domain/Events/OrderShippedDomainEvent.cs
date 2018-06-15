using MediatR;

namespace Order.Domain.Events
{
    public class OrderShippedDomainEvent : INotification
    {
        public AggregatesModel.OrderAggregate.Order Order { get; }

        public OrderShippedDomainEvent(AggregatesModel.OrderAggregate.Order order)
        {
            Order = order;           
        }
    }
}
