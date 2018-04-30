using Enterprise.Abstraction;
using Order.Domain.AggregatesModel.BuyerAggregate;

namespace Order.Infrastructure.Repositories
{
    public class BuyerRepository
        : Repository<Buyer, OrderContext>, IBuyerRepository
    {
        public BuyerRepository(OrderContext context) : base(context)
        {
        }
    }
}