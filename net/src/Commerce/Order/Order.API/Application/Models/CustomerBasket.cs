using System.Collections.Generic;

namespace Order.API.Application.Models
{
    public class CustomerBasket
    {
        public CustomerBasket(string customerId)
        {
            BuyerId = customerId;
            Items = new List<BasketItem>();
        }

        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; }
    }
}