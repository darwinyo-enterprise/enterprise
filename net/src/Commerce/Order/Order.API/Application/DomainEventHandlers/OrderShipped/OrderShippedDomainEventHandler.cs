using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using Order.API.Application.IntegrationEvents;
using Order.API.Application.IntegrationEvents.Events;
using Order.Domain.AggregatesModel.BuyerAggregate;
using Order.Domain.AggregatesModel.OrderAggregate;
using Order.Domain.Events;

namespace Order.API.Application.DomainEventHandlers.OrderShipped
{
    public class OrderShippedDomainEventHandler
        : INotificationHandler<OrderShippedDomainEvent>
    {
        private readonly IBuyerRepository _buyerRepository;
        private readonly ILoggerFactory _logger;
        private readonly IOrderingIntegrationEventService _orderingIntegrationEventService;
        private readonly IOrderRepository _orderRepository;

        public OrderShippedDomainEventHandler(
            IOrderRepository orderRepository,
            ILoggerFactory logger,
            IBuyerRepository buyerRepository,
            IOrderingIntegrationEventService orderingIntegrationEventService)
        {
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _buyerRepository = buyerRepository ?? throw new ArgumentNullException(nameof(buyerRepository));
            _orderingIntegrationEventService = orderingIntegrationEventService;
        }

        public async Task Handle(OrderShippedDomainEvent orderShippedDomainEvent, CancellationToken cancellationToken)
        {
            _logger.CreateLogger(nameof(OrderShippedDomainEvent))
                .LogTrace($"Order with Id: {orderShippedDomainEvent.Order.Id} has been successfully updated with " +
                          $"a status order id: {OrderStatus.Shipped.Id}");

            var order = await _orderRepository.GetAsync(orderShippedDomainEvent.Order.Id);
            var buyer = await _buyerRepository.FindByIdAsync(order.GetBuyerId.Value.ToString());

            var orderStatusChangedToShippedIntegrationEvent =
                new OrderStatusChangedToShippedIntegrationEvent(order.Id, order.OrderStatus.Name, buyer.Name);
            await _orderingIntegrationEventService.PublishThroughEventBusAsync(
                orderStatusChangedToShippedIntegrationEvent);
        }
    }
}