using System.Collections.Generic;
using System.Threading.Tasks;

namespace Order.API.Application.Queries
{
    public interface IOrderQueries
    {
        Task<Order> GetOrderAsync(int id);

        Task<IEnumerable<OrderSummary>> GetOrdersAsync();

        Task<IEnumerable<CardType>> GetCardTypesAsync();
    }
}
