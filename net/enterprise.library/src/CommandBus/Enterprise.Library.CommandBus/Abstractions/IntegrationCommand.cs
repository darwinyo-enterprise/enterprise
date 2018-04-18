using System;

namespace Enterprise.Library.CommandBus.Abstractions
{
    /// <summary>
    ///     Integration Command
    /// </summary>
    public abstract class IntegrationCommand
    {
        protected IntegrationCommand()
        {
            Id = Guid.NewGuid();
            Sent = DateTime.UtcNow;
        }

        public Guid Id { get; }
        public DateTime Sent { get; }

        public abstract object GetDataAsObject();
    }

    /// <summary>
    ///     Integration Command By Type
    /// </summary>
    /// <typeparam name="T">
    /// </typeparam>
    public class IntegrationCommand<T> : IntegrationCommand
    {
        public IntegrationCommand(string name, T data)
        {
            Data = data;
            Name = name;
        }

        public T Data { get; }
        public string Name { get; }

        public override object GetDataAsObject()
        {
            return Data;
        }
    }
}