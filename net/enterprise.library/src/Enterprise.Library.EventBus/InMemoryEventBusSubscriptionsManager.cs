using System;
using System.Collections.Generic;
using System.Linq;
using Enterprise.Library.EventBus.Abstractions;
using Enterprise.Library.EventBus.Events;

namespace Enterprise.Library.EventBus
{
    public partial class InMemoryEventBusSubscriptionsManager : IEventBusSubscriptionsManager
    {
        private readonly List<Type> _eventTypes;
        private readonly Dictionary<string, List<SubscriptionInfo>> _handlers;

        public InMemoryEventBusSubscriptionsManager()
        {
            _handlers = new Dictionary<string, List<SubscriptionInfo>>();
            _eventTypes = new List<Type>();
        }

        /// <summary>
        ///     removed event
        /// </summary>
        public event EventHandler<string> OnEventRemoved;

        /// <summary>
        ///     event handler empty flag
        /// </summary>
        public bool IsEmpty => !_handlers.Keys.Any();

        /// <summary>
        ///     used to clear event handler dictionary
        /// </summary>
        public void Clear()
        {
            _handlers.Clear();
        }

        /// <summary>
        ///     used to add dynamic subscription
        /// </summary>
        /// <typeparam name="TH">
        ///     integration event type
        /// </typeparam>
        /// <param name="eventName">
        ///     event name
        /// </param>
        public void AddDynamicSubscription<TH>(string eventName)
            where TH : IDynamicIntegrationEventHandler
        {
            DoAddSubscription(typeof(TH), eventName, isDynamic: true);
        }

        /// <summary>
        ///     used to add subscription.
        /// </summary>
        /// <typeparam name="T">
        ///     integration event type
        /// </typeparam>
        /// <typeparam name="TH">
        ///     integration event handler type
        /// </typeparam>
        public void AddSubscription<T, TH>()
            where T : IntegrationEvent
            where TH : IIntegrationEventHandler<T>
        {
            var eventName = GetEventKey<T>();
            DoAddSubscription(typeof(TH), eventName, isDynamic: false);
            _eventTypes.Add(typeof(T));
        }

        /// <summary>
        ///     used to remove dynamic subscription by event name
        /// </summary>
        /// <typeparam name="TH">
        ///     integration event handler type
        /// </typeparam>
        /// <param name="eventName">
        ///     event name
        /// </param>
        public void RemoveDynamicSubscription<TH>(string eventName)
            where TH : IDynamicIntegrationEventHandler
        {
            var handlerToRemove = FindDynamicSubscriptionToRemove<TH>(eventName);
            DoRemoveHandler(eventName, subsToRemove: handlerToRemove);
        }

        /// <summary>
        ///     used to Remove event Subscription by integration event type
        /// </summary>
        /// <typeparam name="T">
        ///     integration event type
        /// </typeparam>
        /// <typeparam name="TH">
        ///     integration event handler type
        /// </typeparam>
        public void RemoveSubscription<T, TH>()
            where TH : IIntegrationEventHandler<T>
            where T : IntegrationEvent
        {
            var handlerToRemove = FindSubscriptionToRemove<T, TH>();
            var eventName = GetEventKey<T>();
            DoRemoveHandler(eventName, subsToRemove: handlerToRemove);
        }

        /// <summary>
        ///     used for get list of subscriber by event type
        /// </summary>
        /// <typeparam name="T">
        ///     event type
        /// </typeparam>
        /// <returns>
        ///     list of subscriber
        /// </returns>
        public IEnumerable<SubscriptionInfo> GetHandlersForEvent<T>() where T : IntegrationEvent
        {
            var key = GetEventKey<T>();
            return GetHandlersForEvent(key);
        }

        /// <summary>
        ///     used for get list of subscriber by event name
        /// </summary>
        /// <param name="eventName">
        ///     event name
        /// </param>
        /// <returns>
        ///     list of subscriber
        /// </returns>
        public IEnumerable<SubscriptionInfo> GetHandlersForEvent(string eventName)
        {
            return _handlers[eventName];
        }

        /// <summary>
        ///     used to get is dictionary event handler has this event registered already? By Event Type
        /// </summary>
        /// <typeparam name="T">
        ///     Event that implement IntegrationEvent
        /// </typeparam>
        /// <returns></returns>
        public bool HasSubscriptionsForEvent<T>() where T : IntegrationEvent
        {
            var key = GetEventKey<T>();
            return HasSubscriptionsForEvent(key);
        }

        /// <summary>
        ///     used to get is dictionary event handler has this event registered already?
        /// </summary>
        /// <param name="eventName">
        ///     event name to find
        /// </param>
        /// <returns>
        ///     is already subscribed
        /// </returns>
        public bool HasSubscriptionsForEvent(string eventName)
        {
            return _handlers.ContainsKey(eventName);
        }


        /// <summary>
        ///     get event type by name
        /// </summary>
        /// <param name="eventName">
        ///     event name to find
        /// </param>
        /// <returns>
        ///     type of event
        /// </returns>
        public Type GetEventTypeByName(string eventName)
        {
            return _eventTypes.SingleOrDefault(t => t.Name == eventName);
        }

        /// <summary>
        ///     used to get event name
        /// </summary>
        /// <typeparam name="T">
        ///     Event that implement IntegrationEvent
        /// </typeparam>
        /// <returns>
        ///     name of event
        /// </returns>
        public string GetEventKey<T>()
        {
            return typeof(T).Name;
        }

        /// <summary>
        ///     used to add subscriber whenever its dynamic or typed
        /// </summary>
        /// <param name="handlerType">
        ///     event handler type
        /// </param>
        /// <param name="eventName">
        ///     event name
        /// </param>
        /// <param name="isDynamic">
        ///     is dynamic
        /// </param>
        private void DoAddSubscription(Type handlerType, string eventName, bool isDynamic)
        {
            if (!HasSubscriptionsForEvent(eventName))
                _handlers.Add(eventName, value: new List<SubscriptionInfo>());

            if (_handlers[eventName].Any(s => s.HandlerType == handlerType))
                throw new ArgumentException(
                    $"Handler Type {handlerType.Name} already registered for '{eventName}'", nameof(handlerType));

            _handlers[eventName]
                .Add(isDynamic
                    ? SubscriptionInfo.Dynamic(handlerType)
                    : SubscriptionInfo.Typed(handlerType));
        }

        /// <summary>
        ///     used for remove event handler by event name, and subscription.
        /// </summary>
        /// <param name="eventName">
        ///     event name
        /// </param>
        /// <param name="subsToRemove">
        ///     subscription to remove
        /// </param>
        private void DoRemoveHandler(string eventName, SubscriptionInfo subsToRemove)
        {
            if (subsToRemove != null)
            {
                // remove subscriber from this event
                _handlers[eventName].Remove(subsToRemove);

                // if event name doesnt have any subscription anymore
                if (!_handlers[eventName].Any())
                {
                    // remove event
                    _handlers.Remove(eventName);

                    // get event type by event name
                    var eventType = _eventTypes.SingleOrDefault(e => e.Name == eventName);

                    // if event type is not null
                    if (eventType != null) _eventTypes.Remove(eventType);
                    // raise remove event
                    RaiseOnEventRemoved(eventName);
                }
            }
        }

        /// <summary>
        ///     used for raise on event removed by event name
        /// </summary>
        /// <param name="eventName">
        ///     event name
        /// </param>
        private void RaiseOnEventRemoved(string eventName)
        {
            var handler = OnEventRemoved;
            if (handler != null) OnEventRemoved?.Invoke(this, eventName);
        }


        /// <summary>
        ///     used for find dynamic subscription by event name and handler type
        /// </summary>
        /// <typeparam name="TH">
        ///     dynamic integration event handler
        /// </typeparam>
        /// <param name="eventName">
        ///     event name
        /// </param>
        /// <returns>
        ///     subscriber info object
        /// </returns>
        private SubscriptionInfo FindDynamicSubscriptionToRemove<TH>(string eventName)
            where TH : IDynamicIntegrationEventHandler
        {
            return DoFindSubscriptionToRemove(eventName, handlerType: typeof(TH));
        }


        /// <summary>
        ///     used for find typed subscription by event type and handler type
        /// </summary>
        /// <typeparam name="T">
        ///     event type
        /// </typeparam>
        /// <typeparam name="TH">
        ///     handler type
        /// </typeparam>
        /// <returns>
        ///     subscriber info object
        /// </returns>
        private SubscriptionInfo FindSubscriptionToRemove<T, TH>()
            where T : IntegrationEvent
            where TH : IIntegrationEventHandler<T>
        {
            var eventName = GetEventKey<T>();
            return DoFindSubscriptionToRemove(eventName, handlerType: typeof(TH));
        }


        /// <summary>
        ///     used for find dynamic or typed subscription by eventname and handler type
        /// </summary>
        /// <param name="eventName">
        ///     event name
        /// </param>
        /// <param name="handlerType">
        ///     handler type
        /// </param>
        /// <returns>
        ///     subscriber info object
        /// </returns>
        private SubscriptionInfo DoFindSubscriptionToRemove(string eventName, Type handlerType)
        {
            if (!HasSubscriptionsForEvent(eventName)) return null;

            return _handlers[eventName].SingleOrDefault(s => s.HandlerType == handlerType);
        }
    }
}