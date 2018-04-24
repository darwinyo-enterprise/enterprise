using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Enterprise.Abstraction
{
    public class Repository<T, TContext> : BaseDispose, IRepository<T>
        where T : class, IAggregateRoot
        where TContext : DbContext, IUnitOfWork
    {
        private readonly TContext _context;

        public Repository(TContext context)
        {
            _context = context;
        }

        public IUnitOfWork UnitOfWork => _context;

        public virtual async Task AddAsync(T entity)
        {
            _context.Entry(entity);
            await _context.Set<T>().AddAsync(entity);
        }

        public virtual async Task<IEnumerable<T>> AllIncludingAsync(
            params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> queryable = _context.Set<T>();
            foreach (var includeProperty in includeProperties) queryable = queryable.Include(includeProperty);
            return await queryable.ToListAsync();
        }

        public virtual async Task<long> CountAsync()
        {
            return await _context.Set<T>().CountAsync();
        }

        public virtual void Delete(T entity)
        {
            EntityEntry entityEntry = _context.Entry(entity);
            entityEntry.State = EntityState.Deleted;
        }

        public virtual void DeleteWhere(Expression<Func<T, bool>> predicate)
        {
            IEnumerable<T> entities = _context.Set<T>().Where(predicate);
            foreach (var entity in entities) _context.Entry(entity).State = EntityState.Deleted;
        }

        public virtual async Task<IEnumerable<T>> FindByAsync(Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>().Where(predicate).ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public virtual async Task<T> GetSingleAsync(Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>().FirstOrDefaultAsync(predicate);
        }

        public virtual async Task<T> GetSingleAsync(Expression<Func<T, bool>> predicate,
            params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> queryable = _context.Set<T>();
            foreach (var includeProperty in includeProperties) queryable = queryable.Include(includeProperty);
            return await queryable.FirstOrDefaultAsync(predicate);
        }

        public virtual void Update(T entity)
        {
            EntityEntry entityEntry = _context.Entry(entity);
            entityEntry.State = EntityState.Modified;
        }

        public override void Dispose()
        {
            base.Dispose(_context);
        }
    }
}