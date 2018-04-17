using System;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using Autofac;
using Enterprise.Library.EventBus.Abstractions;
using Enterprise.Library.EventBus.Events;
using Enterprise.Library.EventBus.RabbitMQ.Abstractions;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Polly;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.Exceptions;

namespace Enterprise.Library.EventBus.RabbitMQ
{
    public class EventBusRabbitMq : IEventBus, IDisposable
    {
        private const string BrokerName = "eshop_event_bus";
        private readonly ILifetimeScope _autofac;
        private readonly string _autofacScopeName = "eshop_event_bus";
        private readonly ILogger<EventBusRabbitMq> _logger;

        /// <summary>
        ///     rabbit mq persistance connection
        /// </summary>
        private readonly IRabbitMqPersistentConnection _persistentConnection;

        private readonly int _retryCount;
        private readonly IEventBusSubscriptionsManager _subsManager;

        private IModel _consumerChannel;
        private string _queueName;

        public EventBusRabbitMq(IRabbitMqPersistentConnection persistentConnection, ILogger<EventBusRabbitMq> logger,
            ILifetimeScope autofac, IEventBusSubscriptionsManager subsManager, string queueName = null,
            int retryCount = 5)
        {
            _persistentConnection =
                persistentConnection ?? throw new ArgumentNullException(nameof(persistentConnection));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _subsManager = subsManager ?? new InMemoryEventBusSubscriptionsManager();
            _queueName = queueName;
            _consumerChannel = CreateConsumerChannel();
            _autofac = autofac;
            _retryCount = retryCount;
            _subsManager.OnEventRemoved += SubsManager_OnEventRemoved;
        }

        /// <summary>
        ///     dispose channel
        /// </summary>
        public void Dispose()
        {
            _consumerChannel?.Dispose();

            _subsManager.Clear();
        }

        /// <summary>
        ///     used to publish event.
        ///     this will resilient by default thanks to polly.
        /// </summary>
        /// <param name="event">
        ///     Event to publish.
        /// </param>
        public void Publish(IntegrationEvent @event)
        {
            if (!_persistentConnection.IsConnected) _persistentConnection.TryConnect();

            var policy = Policy.Handle<BrokerUnreachableException>()
                .Or<SocketException>()
                .WaitAndRetry(
                    _retryCount,
                    sleepDurationProvider: retryAttempt =>
                        TimeSpan.FromSeconds(Math.Pow(2, y: retryAttempt)),
                    onRetry: (ex, time) => { _logger.LogWarning(ex.ToString()); });

            using (var channel = _persistentConnection.CreateModel())
            {
                var eventName = @event.GetType().Name;

                // to guarantee exchange exists.
                // type direct means it will directly use bindingkey or routingkey instead of queue name.
                channel.ExchangeDeclare(BrokerName,
                    type: "direct");

                var message = JsonConvert.SerializeObject(@event);
                var body = Encoding.UTF8.GetBytes(message);

                policy.Execute(() =>
                {
                    // ReSharper disable once AccessToDisposedClosure
                    var properties = channel.CreateBasicProperties();
                    properties.DeliveryMode = 2; // persistent

                    // ReSharper disable once AccessToDisposedClosure
                    channel.BasicPublish(BrokerName,
                        routingKey: eventName,
                        mandatory: true,
                        basicProperties: properties,
                        body: body);
                });
            }
        }

        public void SubscribeDynamic<TH>(string eventName)
            where TH : IDynamicIntegrationEventHandler
        {
            DoInternalSubscription(eventName);
            _subsManager.AddDynamicSubscription<TH>(eventName);
        }

        /// <summary>
        ///     used to subscribe event bus
        /// </summary>
        /// <typeparam name="T">
        ///     integration event type
        /// </typeparam>
        /// <typeparam name="TH">
        ///     integration event handler type
        /// </typeparam>
        public void Subscribe<T, TH>()
            where T : IntegrationEvent
            where TH : IIntegrationEventHandler<T>
        {
            var eventName = _subsManager.GetEventKey<T>();
            DoInternalSubscription(eventName);
            _subsManager.AddSubscription<T, TH>();
        }

        /// <summary>
        ///     used for unsubscribe typed event bus
        /// </summary>
        /// <typeparam name="T">
        ///     integration event handler type
        /// </typeparam>
        /// <typeparam name="TH">
        ///     integration event type
        /// </typeparam>
        public void Unsubscribe<T, TH>()
            where TH : IIntegrationEventHandler<T>
            where T : IntegrationEvent
        {
            _subsManager.RemoveSubscription<T, TH>();
        }

        /// <summary>
        ///     used for unsubscribe dynamic event bus
        /// </summary>
        /// <typeparam name="TH">
        ///     integration event type
        /// </typeparam>
        /// <param name="eventName">
        ///     event name
        /// </param>
        public void UnsubscribeDynamic<TH>(string eventName)
            where TH : IDynamicIntegrationEventHandler
        {
            _subsManager.RemoveDynamicSubscription<TH>(eventName);
        }

        /// <summary>
        ///     Event When want to remove integration event.
        /// </summary>
        /// <param name="sender">
        ///     sender object
        /// </param>
        /// <param name="eventName">
        ///     event to remove
        /// </param>
        private void SubsManager_OnEventRemoved(object sender, string eventName)
        {
            if (!_persistentConnection.IsConnected) _persistentConnection.TryConnect();

            using (var channel = _persistentConnection.CreateModel())
            {
                // unbind queue by routing key
                channel.QueueUnbind(_queueName,
                    exchange: BrokerName,
                    routingKey: eventName);

                if (_subsManager.IsEmpty)
                {
                    _queueName = string.Empty;
                    _consumerChannel.Close();
                }
            }
        }

        /// <summary>
        ///     used to create queue and bind queue and exchange
        /// </summary>
        /// <param name="eventName">
        ///     event name for routing key
        /// </param>
        private void DoInternalSubscription(string eventName)
        {
            var containsKey = _subsManager.HasSubscriptionsForEvent(eventName);
            if (!containsKey)
            {
                if (!_persistentConnection.IsConnected) _persistentConnection.TryConnect();

                using (var channel = _persistentConnection.CreateModel())
                {
                    channel.QueueBind(_queueName,
                        exchange: BrokerName,
                        routingKey: eventName);
                }
            }
        }

        /// <summary>
        ///     used to create listener channel
        /// </summary>
        /// <returns>
        ///     subscriber channel
        /// </returns>
        private IModel CreateConsumerChannel()
        {
            if (!_persistentConnection.IsConnected) _persistentConnection.TryConnect();

            var channel = _persistentConnection.CreateModel();

            // make sure exchange is declared
            channel.ExchangeDeclare(BrokerName,
                type: "direct");

            // declare queue
            channel.QueueDeclare(_queueName,
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null);

            // create instance customer
            var consumer = new EventingBasicConsumer(channel);

            // hook customer when event received.
            consumer.Received += async (model, ea) =>
            {
                // routing key is event name.
                var eventName = ea.RoutingKey;

                // get message from event bus
                var message = Encoding.UTF8.GetString(ea.Body);

                // process event (custom)
                await ProcessEvent(eventName, message: message);

                // acknowledge the queue message. to dequeue message.
                channel.BasicAck(ea.DeliveryTag, multiple: false);
            };

            // consume queue
            channel.BasicConsume(_queueName,
                autoAck: false,
                consumer: consumer);

            // if exeception occured then dispose channel and recreate that.
            channel.CallbackException += (sender, ea) =>
            {
                _consumerChannel.Dispose();
                _consumerChannel = CreateConsumerChannel();
            };

            return channel;
        }

        /// <summary>
        ///     used for process event when received.
        ///     this will differentiate dynamic type event or concrete type,
        ///     and it will trigger handle method that specified in each type class.
        /// </summary>
        /// <param name="eventName">
        ///     event name
        /// </param>
        /// <param name="message">
        ///     message that delivered
        /// </param>
        /// <returns>
        ///     none
        /// </returns>
        private async Task ProcessEvent(string eventName, string message)
        {
            // check if already has this event name
            if (_subsManager.HasSubscriptionsForEvent(eventName))
                using (var scope = _autofac.BeginLifetimeScope(_autofacScopeName))
                {
                    // get list subscriber for this event
                    var subscriptions = _subsManager.GetHandlersForEvent(eventName);
                    foreach (var subscription in subscriptions)
                        if (subscription.IsDynamic)
                        {
                            var handler =
                                scope.ResolveOptional(subscription.HandlerType) as
                                    IDynamicIntegrationEventHandler;
                            dynamic eventData = JObject.Parse(message);
                            if (handler != null) await handler.Handle(eventData: eventData);
                        }
                        else
                        {
                            var eventType = _subsManager.GetEventTypeByName(eventName);
                            var integrationEvent = JsonConvert.DeserializeObject(message, type: eventType);
                            var handler = scope.ResolveOptional(subscription.HandlerType);
                            var concreteType = typeof(IIntegrationEventHandler<>).MakeGenericType(eventType);
                            await (Task) concreteType.GetMethod("Handle")
                                .Invoke(handler, parameters: new[] {integrationEvent});
                        }
                }
        }
    }
}