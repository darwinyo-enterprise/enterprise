using System;
using System.Net;
using System.Threading.Tasks;
using Basket.API.IntegrationEvents.Events;
using Basket.API.Model;
using Basket.API.Services;
using Enterprise.Library.EventBus.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Basket.API.Controllers
{
    [Produces("application/json")]
    [Route("api/Basket")]
    [Authorize]
    public class BasketController : Controller
    {
        private readonly IEventBus _eventBus;
        private readonly IIdentityService _identitySvc;
        private readonly IBasketRepository _repository;

        public BasketController(IBasketRepository repository,
            IIdentityService identityService,
            IEventBus eventBus)
        {
            _repository = repository;
            _identitySvc = identityService;
            _eventBus = eventBus;
        }

        /// <summary>
        ///     Get all cart items based on customer id
        /// </summary>
        /// <param name="id">customer id</param>
        /// <returns>
        ///     customer basket
        /// </returns>
        // GET /id
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CustomerBasket), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> Get(string id)
        {
            var basket = await _repository.GetBasketAsync(id);

            return Ok(basket);
        }

        /// <summary>
        ///     used for updating user basket on redis
        /// </summary>
        /// <param name="value">
        ///     object to update
        /// </param>
        /// <returns>
        ///     obejct updated
        /// </returns>
        // POST /value
        [HttpPost]
        [ProducesResponseType(typeof(CustomerBasket), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> Post([FromBody] CustomerBasket value)
        {
            var basket = await _repository.UpdateBasketAsync(value);

            return Ok(basket);
        }

        /// <summary>
        ///     check out functionality, make items in basket to become orders.
        ///     by emit integration event checkout accepted to order api.
        /// </summary>
        /// <param name="basketCheckout">check out informations</param>
        /// <param name="requestId">generated request id</param>
        /// <returns></returns>
        [Route("checkout")]
        [HttpPost]
        [ProducesResponseType((int) HttpStatusCode.Accepted)]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Checkout([FromBody] BasketCheckout basketCheckout,
            [FromHeader(Name = "x-requestid")] string requestId)
        {
            var userId = _identitySvc.GetUserIdentity();
            basketCheckout.RequestId = Guid.TryParse(requestId, out var guid) && guid != Guid.Empty
                ? guid
                : basketCheckout.RequestId;

            var basket = await _repository.GetBasketAsync(userId);

            if (basket == null) return BadRequest();

            var eventMessage = new UserCheckoutAcceptedIntegrationEvent(userId, basketCheckout.City,
                basketCheckout.Street,
                basketCheckout.State, basketCheckout.Country, basketCheckout.ZipCode, basketCheckout.CardNumber,
                basketCheckout.CardHolderName,
                basketCheckout.CardExpiration, basketCheckout.CardSecurityNumber, basketCheckout.CardTypeId,
                basketCheckout.Buyer, basketCheckout.RequestId, basket);

            // Once basket is checkout, sends an integration event to
            // ordering.api to convert basket to order and proceeds with
            // order creation process
            _eventBus.Publish(eventMessage);

            return Accepted();
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _repository.DeleteBasketAsync(id);
        }
    }
}