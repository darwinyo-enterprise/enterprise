﻿using System;

namespace Basket.API.Exceptions
{
    /// <summary>
    ///     Exception type for app exceptions
    /// </summary>
    public class BasketDomainException : Exception
    {
        public BasketDomainException()
        {
        }

        public BasketDomainException(string message)
            : base(message)
        {
        }

        public BasketDomainException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}