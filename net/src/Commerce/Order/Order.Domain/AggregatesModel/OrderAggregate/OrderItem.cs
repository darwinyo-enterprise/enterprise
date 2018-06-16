using Enterprise.Abstraction;
using Order.Domain.Exceptions;
// ReSharper disable FieldCanBeMadeReadOnly.Local

namespace Order.Domain.AggregatesModel.OrderAggregate
{
    public class OrderItem
        : Entity
    {
        private decimal _discount;

        private string _pictureUrl;

        // DDD Patterns comment
        // Using private fields, allowed since EF Core 1.1, is a much better encapsulation
        // aligned with DDD Aggregates and Domain Entities (Instead of properties and property collections)
        private string _productName;
        private decimal _unitPrice;
        private int _units;

        protected OrderItem()
        {
        }

        public OrderItem(string productId, string productName, decimal unitPrice, decimal discount, string pictureUrl,
            int units = 1)
        {
            if (units <= 0) throw new OrderingDomainException("Invalid number of units");

            if (unitPrice * units < discount)
                throw new OrderingDomainException("The total of order item is lower than applied discount");

            ProductId = productId;

            _productName = productName;
            _unitPrice = unitPrice;
            _discount = discount;
            _units = units;
            _pictureUrl = pictureUrl;
        }

        public string ProductId { get; private set; }

        public string GetPictureUri()
        {
            return _pictureUrl;
        }

        public decimal GetCurrentDiscount()
        {
            return _discount;
        }

        public int GetUnits()
        {
            return _units;
        }

        public decimal GetUnitPrice()
        {
            return _unitPrice;
        }

        public string GetOrderItemProductName()
        {
            return _productName;
        }

        public void SetNewDiscount(decimal discount)
        {
            if (discount < 0) throw new OrderingDomainException("Discount is not valid");

            _discount = discount;
        }

        public void AddUnits(int units)
        {
            if (units < 0) throw new OrderingDomainException("Invalid units");

            _units += units;
        }
    }
}