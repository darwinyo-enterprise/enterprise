using System;

namespace Enterprise.Library.CommandBus.Abstractions
{
    /// <summary>
    /// Integration Command
    /// </summary>
    public abstract class IntegrationCommand
    {
        public Guid Id { get; }
        public DateTime Sent { get; }

        public abstract object GetDataAsObject();

        protected IntegrationCommand()
        {
            Id = Guid.NewGuid();
            Sent = DateTime.UtcNow;
        }

    }

    /// <summary>
    /// Integration Command By Type
    /// </summary>
    /// <typeparam name="T">
    /// 
    /// </typeparam>
    public class IntegrationCommand<T> : IntegrationCommand
    {
        public T Data { get; }
        public string Name { get; }
        public override object GetDataAsObject() => Data;

        public IntegrationCommand(string name, T data)
        {
            Data = data;
            Name = name;
        }
    }

}
