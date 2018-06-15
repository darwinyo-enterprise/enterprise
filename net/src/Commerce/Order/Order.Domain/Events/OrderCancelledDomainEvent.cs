using MediatR;

namespace Order.Domain.Events
{
    public class OrderCancelledDomainEvent : INotification
    {
        public AggregatesModel.OrderAggregate.Order Order { get; }

        public OrderCancelledDomainEvent(AggregatesModel.OrderAggregate.Order order)
        {
            Order = order;
        }
    }
}
