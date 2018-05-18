using System;

namespace Enterprise.Library.EventBus.Events
{
    /// <summary>
    ///     This is base implementation of integrated event.
    ///     All Integrated Event will inherits this class
    /// </summary>
    public class IntegrationEvent
    {
        public IntegrationEvent()
        {
            Id = Guid.NewGuid();
            CreationDate = DateTime.UtcNow;
        }

        public Guid Id { get; }
        public DateTime CreationDate { get; }
    }
}