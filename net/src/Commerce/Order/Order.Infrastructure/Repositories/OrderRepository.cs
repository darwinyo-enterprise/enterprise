using Enterprise.Abstraction;
using Order.Domain.AggregatesModel.OrderAggregate;

namespace Order.Infrastructure.Repositories
{
    public class OrderRepository
        : Repository<Domain.AggregatesModel.OrderAggregate.Order, OrderContext>, IOrderRepository
    {
        public OrderRepository(OrderContext context) : base(context)
        {
        }
    }
}