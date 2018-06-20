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

namespace Order.API.Application.DomainEventHandlers.OrderStockConfirmed
{
    public class OrderStatusChangedToStockConfirmedDomainEventHandler
        : INotificationHandler<OrderStatusChangedToStockConfirmedDomainEvent>
    {
        private readonly IBuyerRepository _buyerRepository;
        private readonly ILoggerFactory _logger;
        private readonly IOrderingIntegrationEventService _orderingIntegrationEventService;
        private readonly IOrderRepository _orderRepository;

        public OrderStatusChangedToStockConfirmedDomainEventHandler(
            IOrderRepository orderRepository,
            IBuyerRepository buyerRepository,
            ILoggerFactory logger,
            IOrderingIntegrationEventService orderingIntegrationEventService)
        {
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
            _buyerRepository = buyerRepository ?? throw new ArgumentNullException(nameof(buyerRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _orderingIntegrationEventService = orderingIntegrationEventService;
        }

        public async Task Handle(
            OrderStatusChangedToStockConfirmedDomainEvent orderStatusChangedToStockConfirmedDomainEvent,
            CancellationToken cancellationToken)
        {
            _logger.CreateLogger(nameof(OrderStatusChangedToStockConfirmedDomainEventHandler))
                .LogTrace(
                    $"Order with Id: {orderStatusChangedToStockConfirmedDomainEvent.OrderId} has been successfully updated with " +
                    $"a status order id: {OrderStatus.StockConfirmed.Id}");

            var order = await _orderRepository.GetAsync(orderStatusChangedToStockConfirmedDomainEvent.OrderId);
            var buyer = await _buyerRepository.FindByIdAsync(order.GetBuyerId.Value.ToString());

            var orderStatusChangedToStockConfirmedIntegrationEvent =
                new OrderStatusChangedToStockConfirmedIntegrationEvent(order.Id, order.OrderStatus.Name, buyer.Name);
            await _orderingIntegrationEventService.PublishThroughEventBusAsync(orderStatusChangedToStockConfirmedIntegrationEvent.OrderId, orderStatusChangedToStockConfirmedIntegrationEvent.OrderStatus,
                orderStatusChangedToStockConfirmedIntegrationEvent);
        }
    }
}