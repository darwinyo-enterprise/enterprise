using System;
using Order.Domain.Exceptions;
using Enterprise.Abstraction;

namespace Order.Domain.AggregatesModel.BuyerAggregate
{
    public class PaymentMethod
        : Entity
    {
        private string _alias;
        private readonly string _cardNumber;
        private string _securityNumber;
        private string _cardHolderName;
        private readonly DateTime _expiration;

        private readonly int _cardTypeId;
        public CardType CardType { get; private set; }


        protected PaymentMethod(CardType cardType)
        {
            CardType = cardType;
        }

        public PaymentMethod(int cardTypeId, string alias, string cardNumber, string securityNumber, string cardHolderName, DateTime expiration, CardType cardType)
        {

            _cardNumber = !string.IsNullOrWhiteSpace(cardNumber) ? cardNumber : throw new OrderingDomainException(nameof(cardNumber));
            _securityNumber = !string.IsNullOrWhiteSpace(securityNumber) ? securityNumber : throw new OrderingDomainException(nameof(securityNumber));
            _cardHolderName = !string.IsNullOrWhiteSpace(cardHolderName) ? cardHolderName : throw new OrderingDomainException(nameof(cardHolderName));

            if (expiration < DateTime.UtcNow)
            {
                throw new OrderingDomainException(nameof(expiration));
            }

            _alias = alias;
            _expiration = expiration;
            CardType = cardType;
            _cardTypeId = cardTypeId;
        }

        public bool IsEqualTo(int cardTypeId, string cardNumber,DateTime expiration)
        {
            return _cardTypeId == cardTypeId
                && _cardNumber == cardNumber
                && _expiration == expiration;
        }
    }
}
