using System.Threading.Tasks;
using Enterprise.Abstraction;

namespace Order.Domain.AggregatesModel.OrderAggregate
{
    //This is just the RepositoryContracts or Interface defined at the Domain Layer
    //as requisite for the Order Aggregate

    public interface IOrderRepository : IRepository<Order>
    {
        Order Add(Order order);

        Task<Order> GetAsync(int orderId);
    }
}