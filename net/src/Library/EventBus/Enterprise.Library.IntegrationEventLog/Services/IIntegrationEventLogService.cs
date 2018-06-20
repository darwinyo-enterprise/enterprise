using System.Data.Common;
using System.Threading.Tasks;
using Enterprise.Library.EventBus.Events;

namespace Enterprise.Library.IntegrationEventLog.Services
{
    public interface IIntegrationEventLogService
    {
        Task SaveEventAsync(int orderId, string orderStatus, IntegrationEvent @event, DbTransaction transaction);
        Task MarkEventAsPublishedAsync(IntegrationEvent @event);
    }
}