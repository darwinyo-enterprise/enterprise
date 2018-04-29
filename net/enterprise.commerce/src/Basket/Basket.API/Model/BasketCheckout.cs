using System;

namespace Basket.API.Model
{
    public class BasketCheckout
    {
        public string Buyer { get; set; }

        public Guid RequestId { get; set; }

        #region Location

        public string City { get; set; }

        public string Street { get; set; }

        public string State { get; set; }

        public string Country { get; set; }

        public string ZipCode { get; set; }

        #endregion

        #region Card

        public string CardNumber { get; set; }

        public string CardHolderName { get; set; }

        public DateTime CardExpiration { get; set; }

        public string CardSecurityNumber { get; set; }

        public int CardTypeId { get; set; }

        #endregion
    }
}