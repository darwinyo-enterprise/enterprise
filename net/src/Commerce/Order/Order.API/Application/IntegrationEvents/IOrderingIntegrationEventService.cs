using System.Threading.Tasks;
using Enterprise.Library.EventBus.Events;

namespace Order.API.Application.IntegrationEvents
{
    public interface IOrderingIntegrationEventService
    {
        Task PublishThroughEventBusAsync(IntegrationEvent evt);
    }
}
