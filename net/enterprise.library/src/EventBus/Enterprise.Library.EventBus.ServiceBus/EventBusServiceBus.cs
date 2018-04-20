using System;
using System.Text;
using System.Threading.Tasks;
using Autofac;
using Enterprise.Library.EventBus.Abstractions;
using Enterprise.Library.EventBus.Events;
using Microsoft.Azure.ServiceBus;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Enterprise.Library.EventBus.ServiceBus
{
    public class EventBusServiceBus : IEventBus
    {
        private const string IntegrationEventSufix = "IntegrationEvent";
        private readonly ILifetimeScope _autofac;
        private readonly ILogger<EventBusServiceBus> _logger;
        private readonly IServiceBusPersisterConnection _serviceBusPersisterConnection;
        private readonly SubscriptionClient _subscriptionClient;
        private readonly IEventBusSubscriptionsManager _subsManager;
        private readonly string _autofacScopeName = "commerce_event_bus";

        public EventBusServiceBus(IServiceBusPersisterConnection serviceBusPersisterConnection,
            ILogger<EventBusServiceBus> logger, IEventBusSubscriptionsManager subsManager,
            string subscriptionClientName,
            ILifetimeScope autofac)
        {
            _serviceBusPersisterConnection = serviceBusPersisterConnection;
            _logger = logger;
            _subsManager = subsManager ?? new InMemoryEventBusSubscriptionsManager();

            _subscriptionClient = new SubscriptionClient(
                serviceBusPersisterConnection.ServiceBusConnectionStringBuilder,
                subscriptionClientName);
            _autofac = autofac;

            RemoveDefaultRule();
            RegisterSubscriptionClientMessageHandler();
        }

        public void Publish(IntegrationEvent @event)
        {
            var eventName = @event.GetType().Name.Replace(IntegrationEventSufix, "");
            var jsonMessage = JsonConvert.SerializeObject(@event);
            var body = Encoding.UTF8.GetBytes(jsonMessage);

            var message = new Message
            {
                MessageId = Guid.NewGuid().ToString(),
                Body = body,
                Label = eventName
            };

            var topicClient = _serviceBusPersisterConnection.CreateModel();

            topicClient.SendAsync(message)
                .GetAwaiter()
                .GetResult();
        }

        public void SubscribeDynamic<TH>(string eventName)
            where TH : IDynamicIntegrationEventHandler
        {
            _subsManager.AddDynamicSubscription<TH>(eventName);
        }

        public void Subscribe<T, TH>()
            where T : IntegrationEvent
            where TH : IIntegrationEventHandler<T>
        {
            var eventName = typeof(T).Name.Replace(IntegrationEventSufix, "");

            var containsKey = _subsManager.HasSubscriptionsForEvent<T>();
            if (!containsKey)
                try
                {
                    _subscriptionClient.AddRuleAsync(new RuleDescription
                    {
                        Filter = new CorrelationFilter {Label = eventName},
                        Name = eventName
                    }).GetAwaiter().GetResult();
                }
                catch (ServiceBusException)
                {
                    _logger.LogInformation($"The messaging entity {eventName} already exists.");
                }

            _subsManager.AddSubscription<T, TH>();
        }

        public void Unsubscribe<T, TH>()
            where T : IntegrationEvent
            where TH : IIntegrationEventHandler<T>
        {
            var eventName = typeof(T).Name.Replace(IntegrationEventSufix, "");

            try
            {
                _subscriptionClient
                    .RemoveRuleAsync(eventName)
                    .GetAwaiter()
                    .GetResult();
            }
            catch (MessagingEntityNotFoundException)
            {
                _logger.LogInformation($"The messaging entity {eventName} Could not be found.");
            }

            _subsManager.RemoveSubscription<T, TH>();
        }

        public void UnsubscribeDynamic<TH>(string eventName)
            where TH : IDynamicIntegrationEventHandler
        {
            _subsManager.RemoveDynamicSubscription<TH>(eventName);
        }

        public void Dispose()
        {
            _subsManager.Clear();
        }

        private void RegisterSubscriptionClientMessageHandler()
        {
            _subscriptionClient.RegisterMessageHandler(
                async (message, token) =>
                {
                    var eventName = $"{message.Label}{IntegrationEventSufix}";
                    var messageData = Encoding.UTF8.GetString(message.Body);
                    await ProcessEvent(eventName, messageData);

                    // Complete the message so that it is not received again.
                    await _subscriptionClient.CompleteAsync(message.SystemProperties.LockToken);
                },
                new MessageHandlerOptions(ExceptionReceivedHandler) {MaxConcurrentCalls = 10, AutoComplete = false});
        }

        private Task ExceptionReceivedHandler(ExceptionReceivedEventArgs exceptionReceivedEventArgs)
        {
            Console.WriteLine($"Message handler encountered an exception {exceptionReceivedEventArgs.Exception}.");
            var context = exceptionReceivedEventArgs.ExceptionReceivedContext;
            Console.WriteLine("Exception context for troubleshooting:");
            Console.WriteLine($"- Endpoint: {context.Endpoint}");
            Console.WriteLine($"- Entity Path: {context.EntityPath}");
            Console.WriteLine($"- Executing Action: {context.Action}");
            return Task.CompletedTask;
        }

        private async Task ProcessEvent(string eventName, string message)
        {
            if (_subsManager.HasSubscriptionsForEvent(eventName))
                using (var scope = _autofac.BeginLifetimeScope(_autofacScopeName))
                {
                    var subscriptions = _subsManager.GetHandlersForEvent(eventName);
                    foreach (var subscription in subscriptions)
                        if (subscription.IsDynamic)
                        {
                            dynamic eventData = JObject.Parse(message);
                            if (scope.ResolveOptional(subscription.HandlerType) is IDynamicIntegrationEventHandler handler) await handler.Handle(eventData);
                        }
                        else
                        {
                            var eventType = _subsManager.GetEventTypeByName(eventName);
                            var integrationEvent = JsonConvert.DeserializeObject(message, eventType);
                            var handler = scope.ResolveOptional(subscription.HandlerType);
                            var concreteType = typeof(IIntegrationEventHandler<>).MakeGenericType(eventType);
                            await (Task) concreteType.GetMethod("Handle").Invoke(handler, new[] {integrationEvent});
                        }
                }
        }

        private void RemoveDefaultRule()
        {
            try
            {
                _subscriptionClient
                    .RemoveRuleAsync(RuleDescription.DefaultRuleName)
                    .GetAwaiter()
                    .GetResult();
            }
            catch (MessagingEntityNotFoundException)
            {
                _logger.LogInformation($"The messaging entity {RuleDescription.DefaultRuleName} Could not be found.");
            }
        }
    }
}