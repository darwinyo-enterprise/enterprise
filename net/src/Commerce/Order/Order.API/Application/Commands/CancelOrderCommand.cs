﻿using System.Runtime.Serialization;
using MediatR;

namespace Order.API.Application.Commands
{
    public class CancelOrderCommand : IRequest<bool>
    {
        public CancelOrderCommand(int orderNumber)
        {
            OrderNumber = orderNumber;
        }

        [DataMember] public int OrderNumber { get; private set; }
    }
}