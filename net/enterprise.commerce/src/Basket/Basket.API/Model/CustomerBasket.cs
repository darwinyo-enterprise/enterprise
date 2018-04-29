using System.Collections.Generic;

namespace Basket.API.Model
{
    /// <summary>
    ///     Wrapper Buyer id and what items he/she had in his/her basket
    /// </summary>
    public class CustomerBasket
    {
        public CustomerBasket(string customerId)
        {
            BuyerId = customerId;
            Items = new List<BasketItem>();
        }

        /// <summary>
        ///     person id
        /// </summary>
        public string BuyerId { get; set; }

        /// <summary>
        ///     list of items in basket
        /// </summary>
        public List<BasketItem> Items { get; set; }
    }
}