using System.Collections.Generic;
using Order.API.Application.Commands;
using Order.API.Application.Models;

namespace Order.API.Extensions
{
    public static class BasketItemExtensions
    {
        public static IEnumerable<CreateOrderCommand.OrderItemDto> ToOrderItemsDto(
            this IEnumerable<BasketItem> basketItems)
        {
            foreach (var item in basketItems) yield return item.ToOrderItemDto();
        }

        public static CreateOrderCommand.OrderItemDto ToOrderItemDto(this BasketItem item)
        {
            return new CreateOrderCommand.OrderItemDto
            {
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                PictureUrl = item.PictureUrl,
                UnitPrice = item.UnitPrice,
                Units = item.Quantity
            };
        }
    }
}