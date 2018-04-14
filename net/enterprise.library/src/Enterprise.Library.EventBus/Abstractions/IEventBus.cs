using Enterprise.Library.EventBus.Events;

namespace Enterprise.Library.EventBus.Abstractions
{
    /// <summary>
    ///     Base Contract for event bus
    /// </summary>
    public interface IEventBus
    {
        /// <summary>
        ///     this used for publish or broadcast event that triggered.
        /// </summary>
        /// <param name="event">
        ///     event to trigger
        /// </param>
        void Publish(IntegrationEvent @event);

        /// <summary>
        ///     Used for subscribe integration event.
        /// </summary>
        /// <typeparam name="T">
        ///     type of integration event
        /// </typeparam>
        /// <typeparam name="TH">
        ///     callback method when event triggered
        /// </typeparam>
        void Subscribe<T, TH>()
            where T : IntegrationEvent
            where TH : IIntegrationEventHandler<T>;

        /// <summary>
        ///     used for subscribe to dynamic integration event
        /// </summary>
        /// <typeparam name="TH">
        ///     callback method when event triggered
        /// </typeparam>
        /// <param name="eventName">
        ///     event name
        /// </param>
        void SubscribeDynamic<TH>(string eventName)
            where TH : IDynamicIntegrationEventHandler;

        /// <summary>
        ///     used for unsubscribe to dynamic integration event
        /// </summary>
        /// <typeparam name="TH">
        ///     callback method when event triggered
        /// </typeparam>
        /// <param name="eventName">
        ///     event name
        /// </param>
        void UnsubscribeDynamic<TH>(string eventName)
            where TH : IDynamicIntegrationEventHandler;

        /// <summary>
        ///     Used for unsubscribe integrated event
        /// </summary>
        /// <typeparam name="T">
        ///     type of integration event
        /// </typeparam>
        /// <typeparam name="TH">
        ///     callback method when event triggered
        /// </typeparam>
        void Unsubscribe<T, TH>()
            where TH : IIntegrationEventHandler<T>
            where T : IntegrationEvent;
    }
}