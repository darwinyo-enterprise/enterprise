﻿using Enterprise.Library.EventBus.Events;

namespace Catalog.API.IntegrationEvents.Events
{
    // Integration Events notes: 
    // An Event is “something that has happened in the past”, therefore its name has to be   
    // An Integration Event is an event that can cause side effects to other microsrvices, Bounded-Contexts or external systems.
    public class ProductPriceChangedIntegrationEvent : IntegrationEvent
    {
        public ProductPriceChangedIntegrationEvent(int productId, decimal newPrice, decimal oldPrice)
        {
            ProductId = productId;
            NewPrice = newPrice;
            OldPrice = oldPrice;
        }

        public int ProductId { get; }

        public decimal NewPrice { get; }

        public decimal OldPrice { get; }
    }
}