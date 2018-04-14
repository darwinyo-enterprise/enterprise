using System.Threading.Tasks;

namespace Enterprise.Library.EventBus.Abstractions
{
    /// <summary>
    ///     Base contract of dynamic event data in integration event.
    /// </summary>
    public interface IDynamicIntegrationEventHandler
    {
        /// <summary>
        ///     used for handle event when that event triggered.
        /// </summary>
        /// <param name="eventData">
        ///     dynamic data to handle
        /// </param>
        /// <returns>
        ///     None
        /// </returns>
        Task Handle(dynamic eventData);
    }
}