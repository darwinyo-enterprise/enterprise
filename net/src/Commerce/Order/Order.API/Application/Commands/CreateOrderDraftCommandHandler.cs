using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Order.API.Extensions;

namespace Order.API.Application.Commands
{
    // Regular CommandHandler
    public class CreateOrderDraftCommandHandler
        : IRequestHandler<CreateOrderDraftCommand, OrderDraftDto>
    {
        public Task<OrderDraftDto> Handle(CreateOrderDraftCommand message, CancellationToken cancellationToken)
        {
            var order = Domain.AggregatesModel.OrderAggregate.Order.NewDraft();
            var orderItems = message.Items.Select(i => i.ToOrderItemDto());
            foreach (var item in orderItems)
                order.AddOrderItem(item.ProductId, item.ProductName, item.UnitPrice, item.Discount, item.PictureUrl,
                    item.Units);

            return Task.FromResult(OrderDraftDto.FromOrder(order));
        }
    }


    public class OrderDraftDto
    {
        public IEnumerable<CreateOrderCommand.OrderItemDto> OrderItems { get; set; }
        public decimal Total { get; set; }

        public static OrderDraftDto FromOrder(Domain.AggregatesModel.OrderAggregate.Order order)
        {
            return new OrderDraftDto
            {
                OrderItems = order.OrderItems.Select(oi => new CreateOrderCommand.OrderItemDto
                {
                    Discount = oi.GetCurrentDiscount(),
                    ProductId = oi.ProductId,
                    UnitPrice = oi.GetUnitPrice(),
                    PictureUrl = oi.GetPictureUri(),
                    Units = oi.GetUnits(),
                    ProductName = oi.GetOrderItemProductName()
                }),
                Total = order.GetTotal()
            };
        }
    }
}