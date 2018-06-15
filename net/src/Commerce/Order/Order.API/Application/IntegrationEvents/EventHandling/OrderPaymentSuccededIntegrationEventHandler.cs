using System.Threading.Tasks;
using Enterprise.Library.EventBus.Abstractions;
using Order.API.Application.IntegrationEvents.Events;
using Order.Domain.AggregatesModel.OrderAggregate;

namespace Order.API.Application.IntegrationEvents.EventHandling
{
    public class OrderPaymentSuccededIntegrationEventHandler : 
        IIntegrationEventHandler<OrderPaymentSuccededIntegrationEvent>
    {
        private readonly IOrderRepository _orderRepository;

        public OrderPaymentSuccededIntegrationEventHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task Handle(OrderPaymentSuccededIntegrationEvent @event)
        {
            // Simulate a work time for validating the payment
            await Task.Delay(10000);

            var orderToUpdate = await _orderRepository.GetAsync(@event.OrderId);

            orderToUpdate.SetPaidStatus();

            await _orderRepository.UnitOfWork.SaveEntitiesAsync();
        }
    }
}