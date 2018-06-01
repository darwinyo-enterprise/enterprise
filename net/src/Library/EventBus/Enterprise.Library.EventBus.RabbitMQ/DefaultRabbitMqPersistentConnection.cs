using System;
using System.IO;
using System.Net.Sockets;
using Enterprise.Library.EventBus.RabbitMQ.Abstractions;
using Microsoft.Extensions.Logging;
using Polly;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.Exceptions;

namespace Enterprise.Library.EventBus.RabbitMQ
{
    /// <summary>
    ///     Default Rabbit Connection
    /// </summary>
    public class DefaultRabbitMqPersistentConnection
        : IRabbitMqPersistentConnection
    {
        private readonly IConnectionFactory _connectionFactory;
        private readonly ILogger<DefaultRabbitMqPersistentConnection> _logger;
        private readonly int _retryCount;

        private readonly object _syncRoot = new object();
        private IConnection _connection;
        private bool _disposed;

        public DefaultRabbitMqPersistentConnection(IConnectionFactory connectionFactory,
            ILogger<DefaultRabbitMqPersistentConnection> logger, int retryCount = 5)
        {
            _connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _retryCount = retryCount;
        }

        /// <summary>
        ///     Is Connected Flag
        /// </summary>
        public bool IsConnected => _connection != null && _connection.IsOpen && !_disposed;

        /// <summary>
        ///     Used for create new channel, Session.
        /// </summary>
        /// <returns>
        ///     AMQP Model
        /// </returns>
        public IModel CreateModel()
        {
            if (!IsConnected)
                throw new InvalidOperationException("No RabbitMQ connections are available to perform this action");

            return _connection.CreateModel();
        }

        /// <summary>
        ///     Dispose Connection
        /// </summary>
        public void Dispose()
        {
            if (_disposed) return;

            _disposed = true;

            try
            {
                _connection.Dispose();
            }
            catch (IOException ex)
            {
                _logger.LogCritical(ex.ToString());
            }
        }

        /// <summary>
        ///     used to attempt to connect amqp connection
        /// </summary>
        /// <returns>
        ///     Is Connected
        /// </returns>
        public bool TryConnect()
        {
            _logger.LogInformation("RabbitMQ Client is trying to connect");

            lock (_syncRoot)
            {
                var policy = Policy.Handle<SocketException>()
                    .Or<BrokerUnreachableException>()
                    .WaitAndRetry(_retryCount,
                        retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                        (ex, time) => { _logger.LogWarning(ex.ToString()); }
                    );

                policy.Execute(() =>
                {
                    try
                    {
                        _connection = _connectionFactory
                            .CreateConnection();
                    }
                    catch (Exception)
                    {
                    }
                });

                if (IsConnected)
                {
                    _connection.ConnectionShutdown += OnConnectionShutdown;
                    _connection.CallbackException += OnCallbackException;
                    _connection.ConnectionBlocked += OnConnectionBlocked;

                    _logger.LogInformation(
                        $"RabbitMQ persistent connection acquired a connection {_connection.Endpoint.HostName} and is subscribed to failure events");

                    return true;
                }

                _logger.LogCritical("FATAL ERROR: RabbitMQ connections could not be created and opened");

                return false;
            }
        }

        /// <summary>
        ///     Event handler when Connection Is Closed, but trying to connect.
        /// </summary>
        /// <param name="sender">
        ///     sender event
        /// </param>
        /// <param name="e">
        ///     event args
        /// </param>
        private void OnConnectionBlocked(object sender, ConnectionBlockedEventArgs e)
        {
            if (_disposed) return;

            _logger.LogWarning("A RabbitMQ connection is shutdown. Trying to re-connect...");

            TryConnect();
        }

        /// <summary>
        ///     Callback when connection error occured but attempt to connect
        /// </summary>
        /// <param name="sender">
        ///     sender event
        /// </param>
        /// <param name="e">
        ///     event args
        /// </param>
        private void OnCallbackException(object sender, CallbackExceptionEventArgs e)
        {
            if (_disposed) return;

            _logger.LogWarning("A RabbitMQ connection throw exception. Trying to re-connect...");

            TryConnect();
        }

        /// <summary>
        ///     event handler triggered when connection is on shutdown but attempt to connect
        /// </summary>
        /// <param name="sender">
        ///     sender event
        /// </param>
        /// <param name="reason">
        ///     event args
        /// </param>
        private void OnConnectionShutdown(object sender, ShutdownEventArgs reason)
        {
            if (_disposed) return;

            _logger.LogWarning("A RabbitMQ connection is on shutdown. Trying to re-connect...");

            TryConnect();
        }
    }
}