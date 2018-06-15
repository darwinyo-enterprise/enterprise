using System.Threading.Tasks;
using Enterprise.Library.EventBus.Abstractions;
using Order.API.Application.IntegrationEvents.Events;
using Order.Domain.AggregatesModel.OrderAggregate;

namespace Order.API.Application.IntegrationEvents.EventHandling
{
    public class OrderPaymentFailedIntegrationEventHandler :
        IIntegrationEventHandler<OrderPaymentFailedIntegrationEvent>
    {
        private readonly IOrderRepository _orderRepository;

        public OrderPaymentFailedIntegrationEventHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task Handle(OrderPaymentFailedIntegrationEvent @event)
        {
            var orderToUpdate = await _orderRepository.GetAsync(@event.OrderId);

            orderToUpdate.SetCancelledStatus();

            await _orderRepository.UnitOfWork.SaveEntitiesAsync();
        }
    }
}