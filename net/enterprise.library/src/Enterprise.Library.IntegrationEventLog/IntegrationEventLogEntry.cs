using System;

namespace Enterprise.Library.IntegrationEventLog
{
    /// <summary>
    ///     Integration Event Entity
    /// </summary>
    public class IntegrationEventLogEntry
    {
        public IntegrationEventLogEntry(Guid eventId, string eventTypeName, EventStateEnum state, int timesSent,
            DateTime creationTime, string content)
        {
            EventId = eventId;
            EventTypeName = eventTypeName;
            State = state;
            TimesSent = timesSent;
            CreationTime = creationTime;
            Content = content;
        }

        public Guid EventId { get; }
        public string EventTypeName { get; }
        public EventStateEnum State { get; }
        public int TimesSent { get; }
        public DateTime CreationTime { get; }
        public string Content { get; }
    }
}