using System.Threading.Tasks;
using Enterprise.Library.EventBus.Abstractions;
using Order.API.Application.IntegrationEvents.Events;
using Order.Domain.AggregatesModel.OrderAggregate;

namespace Order.API.Application.IntegrationEvents.EventHandling
{
    public class GracePeriodConfirmedIntegrationEventHandler : IIntegrationEventHandler<GracePeriodConfirmedIntegrationEvent>
    {
        private readonly IOrderRepository _orderRepository;

        public GracePeriodConfirmedIntegrationEventHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        /// <summary>
        /// Event handler which confirms that the grace period
        /// has been completed and order will not initially be cancelled.
        /// Therefore, the order process continues for validation. 
        /// </summary>
        /// <param name="event">       
        /// </param>
        /// <returns></returns>
        public async Task Handle(GracePeriodConfirmedIntegrationEvent @event)
        {
            var orderToUpdate = await _orderRepository.GetAsync(@event.OrderId);
            orderToUpdate.SetAwaitingValidationStatus();
            await _orderRepository.UnitOfWork.SaveEntitiesAsync();
        }
    }
}
