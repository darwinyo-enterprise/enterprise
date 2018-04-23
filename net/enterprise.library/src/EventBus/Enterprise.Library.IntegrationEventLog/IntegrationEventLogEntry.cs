using System;
using Enterprise.Library.EventBus.Events;
using Newtonsoft.Json;

namespace Enterprise.Library.IntegrationEventLog
{
    /// <summary>
    ///     Integration Event Entity
    /// </summary>
    public class IntegrationEventLogEntry
    {
        public IntegrationEventLogEntry(IntegrationEvent @event)
        {
            EventId = @event.Id;
            CreationTime = @event.CreationDate;
            EventTypeName = @event.GetType().FullName;
            Content = JsonConvert.SerializeObject(@event);
            State = EventStateEnum.NotPublished;
            TimesSent = 0;
        }

        public Guid EventId { get; set; }
        public string EventTypeName { get; set; }
        public EventStateEnum State { get; set; }
        public int TimesSent { get; set; }
        public DateTime CreationTime { get; set; }
        public string Content { get; set; }
    }
}