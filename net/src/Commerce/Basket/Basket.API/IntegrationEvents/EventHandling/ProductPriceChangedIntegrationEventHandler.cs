using System;
using System.Linq;
using System.Threading.Tasks;
using Basket.API.IntegrationEvents.Events;
using Basket.API.Model;
using Enterprise.Library.EventBus.Abstractions;

namespace Basket.API.IntegrationEvents.EventHandling
{
    public class
        ProductPriceChangedIntegrationEventHandler : IIntegrationEventHandler<ProductPriceChangedIntegrationEvent>
    {
        private readonly IBasketRepository _repository;

        public ProductPriceChangedIntegrationEventHandler(IBasketRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        /// <summary>
        ///     handle price changed event emitted from catalog Api.
        /// </summary>
        /// <param name="event">
        ///     event emitted
        /// </param>
        /// <returns></returns>
        public async Task Handle(ProductPriceChangedIntegrationEvent @event)
        {
            var userIds = _repository.GetUsers();

            foreach (var id in userIds)
            {
                var basket = await _repository.GetBasketAsync(id);

                await UpdatePriceInBasketItems(@event.ProductId, @event.NewPrice, @event.OldPrice, basket);
            }
        }

        private async Task UpdatePriceInBasketItems(int productId, decimal newPrice, decimal oldPrice,
            CustomerBasket basket)
        {
            var match = productId.ToString();
            var itemsToUpdate = basket?.Items?.Where(x => x.ProductId == match).ToList();

            if (itemsToUpdate != null)
            {
                foreach (var item in itemsToUpdate)
                    if (item.UnitPrice == oldPrice)
                    {
                        var originalPrice = item.UnitPrice;
                        item.UnitPrice = newPrice;
                        item.OldUnitPrice = originalPrice;
                    }

                await _repository.UpdateBasketAsync(basket);
            }
        }
    }
}