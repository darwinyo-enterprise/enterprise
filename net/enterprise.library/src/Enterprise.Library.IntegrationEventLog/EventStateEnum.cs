namespace Enterprise.Library.IntegrationEventLog
{
    /// <summary>
    ///     State To Integration Event
    /// </summary>
    public enum EventStateEnum
    {
        NotPublished = 0,
        Published = 1,
        PublishedFailed = 2
    }
}