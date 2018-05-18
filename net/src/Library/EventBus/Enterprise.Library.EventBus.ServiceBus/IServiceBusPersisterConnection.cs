﻿using System;
using Microsoft.Azure.ServiceBus;

namespace Enterprise.Library.EventBus.ServiceBus
{
    public interface IServiceBusPersisterConnection : IDisposable
    {
        ServiceBusConnectionStringBuilder ServiceBusConnectionStringBuilder { get; }

        ITopicClient CreateModel();
    }
}