﻿using System;
using MediatR;

namespace Order.Domain.Events
{
    /// <summary>
    ///     Event used when an order is created
    /// </summary>
    public class OrderStartedDomainEvent : INotification
    {
        public OrderStartedDomainEvent(AggregatesModel.OrderAggregate.Order order, string userId,
            int cardTypeId, string cardNumber,
            string cardSecurityNumber, string cardHolderName,
            DateTime cardExpiration)
        {
            Order = order;
            UserId = userId;
            CardTypeId = cardTypeId;
            CardNumber = cardNumber;
            CardSecurityNumber = cardSecurityNumber;
            CardHolderName = cardHolderName;
            CardExpiration = cardExpiration;
        }

        public string UserId { get; }
        public int CardTypeId { get; }
        public string CardNumber { get; }
        public string CardSecurityNumber { get; }
        public string CardHolderName { get; }
        public DateTime CardExpiration { get; }
        public Order Order { get; }
    }
}