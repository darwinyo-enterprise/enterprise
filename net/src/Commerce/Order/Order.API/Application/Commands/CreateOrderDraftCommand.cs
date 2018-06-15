using System.Collections.Generic;
using MediatR;
using Order.API.Application.Models;

namespace Order.API.Application.Commands
{
    public class CreateOrderDraftCommand : IRequest<OrderDraftDTO>
    {
        public CreateOrderDraftCommand(string buyerId, IEnumerable<BasketItem> items)
        {
            BuyerId = buyerId;
            Items = items;
        }

        public string BuyerId { get; private set; }

        public IEnumerable<BasketItem> Items { get; private set; }
    }
}