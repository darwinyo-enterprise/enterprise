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
        : IRequestHandler<CreateOrderDraftCommand, OrderDraftDTO>
    {
        public Task<OrderDraftDTO> Handle(CreateOrderDraftCommand message, CancellationToken cancellationToken)
        {
            var order = Domain.AggregatesModel.OrderAggregate.Order.NewDraft();
            var orderItems = message.Items.Select(i => i.ToOrderItemDTO());
            foreach (var item in orderItems)
                order.AddOrderItem(item.ProductId, item.ProductName, item.UnitPrice, item.Discount, item.PictureUrl,
                    item.Units);

            return Task.FromResult(OrderDraftDTO.FromOrder(order));
        }
    }


    public class OrderDraftDTO
    {
        public IEnumerable<CreateOrderCommand.OrderItemDTO> OrderItems { get; set; }
        public decimal Total { get; set; }

        public static OrderDraftDTO FromOrder(Domain.AggregatesModel.OrderAggregate.Order order)
        {
            return new OrderDraftDTO
            {
                OrderItems = order.OrderItems.Select(oi => new CreateOrderCommand.OrderItemDTO
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