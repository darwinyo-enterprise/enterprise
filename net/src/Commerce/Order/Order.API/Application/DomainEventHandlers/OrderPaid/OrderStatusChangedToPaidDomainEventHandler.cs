using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using Order.API.Application.IntegrationEvents;
using Order.API.Application.IntegrationEvents.Events;
using Order.Domain.AggregatesModel.BuyerAggregate;
using Order.Domain.AggregatesModel.OrderAggregate;
using Order.Domain.Events;

namespace Order.API.Application.DomainEventHandlers.OrderPaid
{
    public class OrderStatusChangedToPaidDomainEventHandler
        : INotificationHandler<OrderStatusChangedToPaidDomainEvent>
    {
        private readonly IBuyerRepository _buyerRepository;
        private readonly ILoggerFactory _logger;
        private readonly IOrderingIntegrationEventService _orderingIntegrationEventService;
        private readonly IOrderRepository _orderRepository;


        public OrderStatusChangedToPaidDomainEventHandler(
            IOrderRepository orderRepository, ILoggerFactory logger,
            IBuyerRepository buyerRepository,
            IOrderingIntegrationEventService orderingIntegrationEventService
        )
        {
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _buyerRepository = buyerRepository ?? throw new ArgumentNullException(nameof(buyerRepository));
            _orderingIntegrationEventService = orderingIntegrationEventService ??
                                               throw new ArgumentNullException(nameof(orderingIntegrationEventService));
        }

        public async Task Handle(OrderStatusChangedToPaidDomainEvent orderStatusChangedToPaidDomainEvent,
            CancellationToken cancellationToken)
        {
            _logger.CreateLogger(nameof(OrderStatusChangedToPaidDomainEventHandler))
                .LogTrace(
                    $"Order with Id: {orderStatusChangedToPaidDomainEvent.OrderId} has been successfully updated with " +
                    $"a status order id: {OrderStatus.Paid.Id}");

            var order = await _orderRepository.GetAsync(orderStatusChangedToPaidDomainEvent.OrderId);
            var buyer = await _buyerRepository.FindByIdAsync(order.GetBuyerId.Value.ToString());

            var orderStockList = orderStatusChangedToPaidDomainEvent.OrderItems
                .Select(orderItem => new OrderStockItem(orderItem.ProductId, orderItem.GetUnits()));

            var orderStatusChangedToPaidIntegrationEvent = new OrderStatusChangedToPaidIntegrationEvent(
                orderStatusChangedToPaidDomainEvent.OrderId,
                order.OrderStatus.Name,
                buyer.Name,
                orderStockList);

            await _orderingIntegrationEventService.PublishThroughEventBusAsync(
                orderStatusChangedToPaidIntegrationEvent);
        }
    }
}