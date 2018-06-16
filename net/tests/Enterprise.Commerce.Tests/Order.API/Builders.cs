using System;
using Order.Domain.AggregatesModel.OrderAggregate;

namespace Enterprise.Commerce.Tests.Order.API
{
    public class AddressBuilder
    {
        public Address Build()
        {
            return new Address("street", "city", "state", "country", "zipcode");
        }
    }

    public class OrderBuilder
    {
        private readonly global::Order.Domain.AggregatesModel.OrderAggregate.Order _order;

        public OrderBuilder(Address address)
        {
            _order = new global::Order.Domain.AggregatesModel.OrderAggregate.Order(
                "userId",
                "fakeName",
                address,
                cardTypeId:5,
                cardNumber:"12",
                cardSecurityNumber:"123",
                cardHolderName:"name",
                cardExpiration:DateTime.UtcNow);
        }

        public OrderBuilder AddOne(
            string productId,
            string productName,
            decimal unitPrice,
            decimal discount,
            string pictureUrl,
            int units = 1)
        {
            _order.AddOrderItem(productId, productName, unitPrice, discount, pictureUrl, units);
            return this;
        }

        public global::Order.Domain.AggregatesModel.OrderAggregate.Order Build()
        {
            return _order;
        }
    }
}
