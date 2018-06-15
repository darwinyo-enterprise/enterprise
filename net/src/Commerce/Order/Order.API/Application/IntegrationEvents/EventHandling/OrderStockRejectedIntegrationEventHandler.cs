using System.Linq;
using System.Threading.Tasks;
using Enterprise.Library.EventBus.Abstractions;
using Order.API.Application.IntegrationEvents.Events;
using Order.Domain.AggregatesModel.OrderAggregate;

namespace Order.API.Application.IntegrationEvents.EventHandling
{
    public class OrderStockRejectedIntegrationEventHandler : IIntegrationEventHandler<OrderStockRejectedIntegrationEvent>
    {
        private readonly IOrderRepository _orderRepository;

        public OrderStockRejectedIntegrationEventHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task Handle(OrderStockRejectedIntegrationEvent @event)
        {
            var orderToUpdate = await _orderRepository.GetAsync(@event.OrderId);

            var orderStockRejectedItems = @event.OrderStockItems
                .FindAll(c => !c.HasStock)
                .Select(c => c.ProductId);

            orderToUpdate.SetCancelledStatusWhenStockIsRejected(orderStockRejectedItems);

            await _orderRepository.UnitOfWork.SaveEntitiesAsync();
        }
    }
}