using System;

namespace Enterprise.Library.EventBus
{
    public partial class InMemoryEventBusSubscriptionsManager
    {
        /// <summary>
        ///     Subscription info Model
        /// </summary>
        public class SubscriptionInfo
        {
            private SubscriptionInfo(bool isDynamic, Type handlerType)
            {
                IsDynamic = isDynamic;
                HandlerType = handlerType;
            }

            /// <summary>
            ///     Flag is subscription is dynamic
            /// </summary>
            public bool IsDynamic { get; }

            /// <summary>
            ///     Event Handler Type
            /// </summary>
            public Type HandlerType { get; }

            /// <summary>
            ///     used to init dynamic type subscription
            /// </summary>
            /// <param name="handlerType">
            ///     event handler type
            /// </param>
            /// <returns>
            ///     Subscription Model
            /// </returns>
            public static SubscriptionInfo Dynamic(Type handlerType)
            {
                return new SubscriptionInfo(true, handlerType);
            }

            /// <summary>
            ///     used to init not dynamic type subscription
            /// </summary>
            /// <param name="handlerType">
            ///     event handler type
            /// </param>
            /// <returns>
            ///     Subscription Model
            /// </returns>
            public static SubscriptionInfo Typed(Type handlerType)
            {
                return new SubscriptionInfo(false, handlerType);
            }
        }
    }
}