using System.Runtime.Serialization;
using MediatR;

namespace Order.API.Application.Commands
{
    public class CancelOrderCommand : IRequest<bool>
    {

        [DataMember]
        public int OrderNumber { get; private set; }

        public CancelOrderCommand(int orderNumber)
        {
            OrderNumber = orderNumber;
        }
    }
}
