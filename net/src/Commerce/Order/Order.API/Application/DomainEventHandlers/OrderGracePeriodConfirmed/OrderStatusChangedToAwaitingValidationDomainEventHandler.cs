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

namespace Order.API.Application.DomainEventHandlers.OrderGracePeriodConfirmed
{
    public class OrderStatusChangedToAwaitingValidationDomainEventHandler
                   : INotificationHandler<OrderStatusChangedToAwaitingValidationDomainEvent>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ILoggerFactory _logger;
        private readonly IBuyerRepository _buyerRepository;
        private readonly IOrderingIntegrationEventService _orderingIntegrationEventService;

        public OrderStatusChangedToAwaitingValidationDomainEventHandler(
            IOrderRepository orderRepository, ILoggerFactory logger,
            IBuyerRepository buyerRepository,
            IOrderingIntegrationEventService orderingIntegrationEventService)
        {
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _buyerRepository = buyerRepository;
            _orderingIntegrationEventService = orderingIntegrationEventService;           
        }

        public async Task Handle(OrderStatusChangedToAwaitingValidationDomainEvent orderStatusChangedToAwaitingValidationDomainEvent, CancellationToken cancellationToken)
        {
            _logger.CreateLogger(nameof(OrderStatusChangedToAwaitingValidationDomainEvent))
                  .LogTrace($"Order with Id: {orderStatusChangedToAwaitingValidationDomainEvent.OrderId} has been successfully updated with " +
                            $"a status order id: {OrderStatus.AwaitingValidation.Id}");

            var order = await _orderRepository.GetAsync(orderStatusChangedToAwaitingValidationDomainEvent.OrderId);

            var buyer = await _buyerRepository.FindByIdAsync(order.GetBuyerId.Value.ToString());

            var orderStockList = orderStatusChangedToAwaitingValidationDomainEvent.OrderItems
                .Select(orderItem => new OrderStockItem(orderItem.ProductId, orderItem.GetUnits()));

            var orderStatusChangedToAwaitingValidationIntegrationEvent = new OrderStatusChangedToAwaitingValidationIntegrationEvent(
                order.Id, order.OrderStatus.Name, buyer.Name, orderStockList);
            await _orderingIntegrationEventService.PublishThroughEventBusAsync(orderStatusChangedToAwaitingValidationIntegrationEvent);
        }
    }  
}