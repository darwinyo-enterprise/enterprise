using System;
using System.Collections.Generic;
using System.Text;

namespace Enterprise.Abstraction
{
    public interface IRepository<T> where T : IAggregateRoot
    {
        IUnitOfWork UnitOfWork { get; }
    }
}
