﻿using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Order.Domain.AggregatesModel.OrderAggregate;
using Order.Infrastructure.Idempotency;

namespace Order.API.Application.Commands
{
    // Regular CommandHandler
    public class CancelOrderCommandHandler : IRequestHandler<CancelOrderCommand, bool>
    {
        private readonly IOrderRepository _orderRepository;

        public CancelOrderCommandHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        /// <summary>
        ///     Handler which processes the command when
        ///     customer executes cancel order from app
        /// </summary>
        /// <param name="command"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<bool> Handle(CancelOrderCommand command, CancellationToken cancellationToken)
        {
            var orderToUpdate = await _orderRepository.GetAsync(command.OrderNumber);
            if (orderToUpdate == null) return false;

            orderToUpdate.SetCancelledStatus();
            return await _orderRepository.UnitOfWork.SaveEntitiesAsync();
        }
    }


    // Use for Idempotency in Command process
    public class CancelOrderIdentifiedCommandHandler : IdentifiedCommandHandler<CancelOrderCommand, bool>
    {
        public CancelOrderIdentifiedCommandHandler(IMediator mediator, IRequestManager requestManager) : base(mediator,
            requestManager)
        {
        }

        protected override bool CreateResultForDuplicateRequest()
        {
            return true; // Ignore duplicate requests for processing order.
        }
    }
}