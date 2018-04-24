using System;
using Microsoft.EntityFrameworkCore;

namespace Enterprise.Abstraction
{
    public abstract class BaseDispose : IDisposable
    {
        private bool _disposed;

        public abstract void Dispose();

        protected virtual void Dispose(bool disposing, DbContext context)
        {
            if (!_disposed)
                if (disposing)
                    context.Dispose();
            _disposed = true;
        }

        public void Dispose(DbContext context)
        {
            Dispose(true, context);
            GC.SuppressFinalize(this);
        }
    }
}