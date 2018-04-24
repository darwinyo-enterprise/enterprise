using System.Collections.Generic;
using MediatR;

namespace Enterprise.Abstraction
{
    public abstract class Entity
    {
        private int? _requestedHashCode;

        public virtual int Id { get; protected set; }

        public List<INotification> DomainEvents { get; private set; }

        public void AddDomainEvent(INotification eventItem)
        {
            DomainEvents = DomainEvents ?? new List<INotification>();
            DomainEvents.Add(eventItem);
        }

        public void RemoveDomainEvent(INotification eventItem)
        {
            DomainEvents?.Remove(eventItem);
        }

        public bool IsTransient()
        {
            return Id == default(int);
        }

        public override bool Equals(object obj)
        {
            if (!(obj is Entity))
                return false;

            if (ReferenceEquals(this, obj))
                return true;

            if (GetType() != obj.GetType())
                return false;

            var item = (Entity) obj;

            if (item.IsTransient() || IsTransient())
                return false;
            return item.Id == Id;
        }

        public override int GetHashCode()
        {
            if (IsTransient()) return base.GetHashCode();
            // ReSharper disable once NonReadonlyMemberInGetHashCode
            if (!_requestedHashCode.HasValue)
                // ReSharper disable once NonReadonlyMemberInGetHashCode
                _requestedHashCode =
                    // ReSharper disable once NonReadonlyMemberInGetHashCode
                    Id.GetHashCode() ^
                    31; // XOR for random distribution (http://blogs.msdn.com/b/ericlippert/archive/2011/02/28/guidelines-and-rules-for-gethashcode.aspx)

            // ReSharper disable once NonReadonlyMemberInGetHashCode
            return _requestedHashCode.Value;
        }

        public static bool operator ==(Entity left, Entity right)
        {
            if (Equals(left, null))
                return Equals(right, null);
            return left.Equals(right);
        }

        public static bool operator !=(Entity left, Entity right)
        {
            return !(left == right);
        }
    }
}