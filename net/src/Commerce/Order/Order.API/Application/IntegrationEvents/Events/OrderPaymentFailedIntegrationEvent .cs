﻿using Enterprise.Library.EventBus.Events;

namespace Order.API.Application.IntegrationEvents.Events
{
    public class OrderPaymentFailedIntegrationEvent : IntegrationEvent
    {
        public OrderPaymentFailedIntegrationEvent(int orderId)
        {
            OrderId = orderId;
        }

        public int OrderId { get; }
    }
}