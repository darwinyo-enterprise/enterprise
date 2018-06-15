using System.Threading.Tasks;
using Enterprise.Library.EventBus.Abstractions;
using Order.API.Application.IntegrationEvents.Events;
using Order.Domain.AggregatesModel.OrderAggregate;

namespace Order.API.Application.IntegrationEvents.EventHandling
{
    public class OrderStockConfirmedIntegrationEventHandler : 
        IIntegrationEventHandler<OrderStockConfirmedIntegrationEvent>
    {
        private readonly IOrderRepository _orderRepository;

        public OrderStockConfirmedIntegrationEventHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task Handle(OrderStockConfirmedIntegrationEvent @event)
        {
            // Simulate a work time for confirming the stock
            await Task.Delay(10000);

            var orderToUpdate = await _orderRepository.GetAsync(@event.OrderId);

            orderToUpdate.SetStockConfirmedStatus();

            await _orderRepository.UnitOfWork.SaveEntitiesAsync();
        }
    }
}