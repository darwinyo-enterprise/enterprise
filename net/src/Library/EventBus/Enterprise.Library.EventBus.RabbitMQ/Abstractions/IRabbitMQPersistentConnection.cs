using System;
using RabbitMQ.Client;

namespace Enterprise.Library.EventBus.RabbitMQ.Abstractions
{
    /// <summary>
    ///     Abstraction Of Rabbit MQ Persistence Connection
    /// </summary>
    public interface IRabbitMqPersistentConnection
        : IDisposable
    {
        /// <summary>
        ///     Flag If Connected
        /// </summary>
        bool IsConnected { get; }

        /// <summary>
        ///     used to attempt to connect amqp connection
        /// </summary>
        /// <returns>
        ///     Is Connected
        /// </returns>
        bool TryConnect();

        /// <summary>
        ///     Used for create new channel, Session.
        /// </summary>
        /// <returns>
        ///     AMQP Model
        /// </returns>
        IModel CreateModel();
    }
}