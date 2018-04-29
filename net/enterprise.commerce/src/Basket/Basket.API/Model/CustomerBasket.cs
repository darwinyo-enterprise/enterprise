using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Basket.API.Model
{
    /// <summary>
    /// Wrapper Buyer id and what items he/she had in his/her basket
    /// </summary>
    public class CustomerBasket
    {
        /// <summary>
        /// person id
        /// </summary>
        public string BuyerId { get; set; }
        /// <summary>
        /// list of items in basket
        /// </summary>
        public List<BasketItem> Items { get; set; }

        public CustomerBasket(string customerId)
        {
            BuyerId = customerId;
            Items = new List<BasketItem>();
        }
    }
}
