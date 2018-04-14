using System.Threading.Tasks;
using Enterprise.Library.EventBus.Events;

namespace Enterprise.Library.EventBus.Abstractions
{
    /// <summary>
    ///     This is abstract implementation of integration event handler.
    /// </summary>
    /// <typeparam name="TIntegrationEvent">
    ///     Type Event to handle
    /// </typeparam>
    public interface IIntegrationEventHandler<in TIntegrationEvent> : IIntegrationEventHandler
        where TIntegrationEvent : IntegrationEvent
    {
        /// <summary>
        ///     base handle method, used to handle action when event triggered.
        /// </summary>
        /// <param name="event">
        ///     Type Event to handle
        /// </param>
        /// <returns>
        ///     None
        /// </returns>
        Task Handle(TIntegrationEvent @event);
    }

    /// <summary>
    ///     base implementation of integration event handler
    /// </summary>
    public interface IIntegrationEventHandler
    {
    }
}