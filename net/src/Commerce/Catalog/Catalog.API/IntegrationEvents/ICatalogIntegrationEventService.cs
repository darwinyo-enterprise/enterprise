using System.Threading.Tasks;
using Enterprise.Library.EventBus.Events;

namespace Catalog.API.IntegrationEvents
{
    public interface ICatalogIntegrationEventService
    {
        Task SaveEventAndCatalogContextChangesAsync(int orderId,string orderStatus, IntegrationEvent evt);
        Task PublishThroughEventBusAsync(IntegrationEvent evt);
    }
}