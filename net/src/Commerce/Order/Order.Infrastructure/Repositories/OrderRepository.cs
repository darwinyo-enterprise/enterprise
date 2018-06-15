using System;
using System.Threading.Tasks;
using Enterprise.Abstraction;
using Microsoft.EntityFrameworkCore;
using Order.Domain.AggregatesModel.OrderAggregate;

namespace Order.Infrastructure.Repositories
{
    public class OrderRepository
        : Repository<Domain.AggregatesModel.OrderAggregate.Order, OrderingContext>, IOrderRepository
    {
        private readonly OrderingContext _context;

        public OrderRepository(OrderingContext context) : base(context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public Domain.AggregatesModel.OrderAggregate.Order Add(Domain.AggregatesModel.OrderAggregate.Order order)
        {
            return _context.Orders.Add(order).Entity;

        }

        public async Task<Domain.AggregatesModel.OrderAggregate.Order> GetAsync(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order != null)
            {
                await _context.Entry(order)
                    .Collection(i => i.OrderItems).LoadAsync();
                await _context.Entry(order)
                    .Reference(i => i.OrderStatus).LoadAsync();
                await _context.Entry(order)
                    .Reference(i => i.Address).LoadAsync();
            }

            return order;
        }
    }
}
