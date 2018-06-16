using System.Collections.Generic;
using MediatR;
using Order.API.Application.Models;

namespace Order.API.Application.Commands
{
    public class CreateOrderDraftCommand : IRequest<OrderDraftDto>
    {
        public CreateOrderDraftCommand(string buyerId, IEnumerable<BasketItem> items)
        {
            BuyerId = buyerId;
            Items = items;
        }

        public string BuyerId { get; }

        public IEnumerable<BasketItem> Items { get; }
    }
}