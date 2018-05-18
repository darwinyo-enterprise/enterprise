using System;
using System.Collections.Generic;
using Enterprise.Library.EventBus.Events;

namespace Enterprise.Library.EventBus.Abstractions
{
    /// <summary>
    ///     Event bus subscription manager
    /// </summary>
    public interface IEventBusSubscriptionsManager
    {
        /// <summary>
        ///     event handler empty flag
        /// </summary>
        bool IsEmpty { get; }

        /// <summary>
        ///     removed event
        /// </summary>
        event EventHandler<string> OnEventRemoved;

        /// <summary>
        ///     used for get list of subscriber by event type
        /// </summary>
        /// <typeparam name="T">
        ///     event type
        /// </typeparam>
        /// <returns>
        ///     list of subscriber
        /// </returns>
        IEnumerable<InMemoryEventBusSubscriptionsManager.SubscriptionInfo> GetHandlersForEvent<T>()
            where T : IntegrationEvent;

        /// <summary>
        ///     used for get list of subscriber by event name
        /// </summary>
        /// <param name="eventName">
        ///     event name
        /// </param>
        /// <returns>
        ///     list of subscriber
        /// </returns>
        IEnumerable<InMemoryEventBusSubscriptionsManager.SubscriptionInfo> GetHandlersForEvent(string eventName);

        /// <summary>
        ///     used to clear event handler dictionary
        /// </summary>
        void Clear();

        /// <summary>
        ///     used to add dynamic subscription
        /// </summary>
        /// <typeparam name="TH">
        ///     integration event type
        /// </typeparam>
        /// <param name="eventName">
        ///     event name
        /// </param>
        void AddDynamicSubscription<TH>(string eventName)
            where TH : IDynamicIntegrationEventHandler;

        /// <summary>
        ///     used to add subscription.
        /// </summary>
        /// <typeparam name="T">
        ///     integration event type
        /// </typeparam>
        /// <typeparam name="TH">
        ///     integration event handler type
        /// </typeparam>
        void AddSubscription<T, TH>()
            where T : IntegrationEvent
            where TH : IIntegrationEventHandler<T>;

        /// <summary>
        ///     used to remove dynamic subscription by event name
        /// </summary>
        /// <typeparam name="TH">
        ///     integration event handler type
        /// </typeparam>
        /// <param name="eventName">
        ///     event name
        /// </param>
        void RemoveDynamicSubscription<TH>(string eventName)
            where TH : IDynamicIntegrationEventHandler;

        /// <summary>
        ///     used to Remove event Subscription by integration event type
        /// </summary>
        /// <typeparam name="T">
        ///     integration event type
        /// </typeparam>
        /// <typeparam name="TH">
        ///     integration event handler type
        /// </typeparam>
        void RemoveSubscription<T, TH>()
            where TH : IIntegrationEventHandler<T>
            where T : IntegrationEvent;

        /// <summary>
        ///     used to get is dictionary event handler has this event registered already? By Event Type
        /// </summary>
        /// <typeparam name="T">
        ///     Event that implement IntegrationEvent
        /// </typeparam>
        /// <returns></returns>
        bool HasSubscriptionsForEvent<T>() where T : IntegrationEvent;

        /// <summary>
        ///     used to get is dictionary event handler has this event registered already?
        /// </summary>
        /// <param name="eventName">
        ///     event name to find
        /// </param>
        /// <returns>
        ///     is already subscribed
        /// </returns>
        bool HasSubscriptionsForEvent(string eventName);


        /// <summary>
        ///     get event type by name
        /// </summary>
        /// <param name="eventName">
        ///     event name to find
        /// </param>
        /// <returns>
        ///     type of event
        /// </returns>
        Type GetEventTypeByName(string eventName);

        /// <summary>
        ///     used to get event name
        /// </summary>
        /// <typeparam name="T">
        ///     Event that implement IntegrationEvent
        /// </typeparam>
        /// <returns>
        ///     name of event
        /// </returns>
        string GetEventKey<T>();
    }
}