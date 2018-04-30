using System.Collections.Generic;

namespace Catalog.API.ViewModels
{
    public class PaginatedCatalogViewModel<TEntity> where TEntity : class
    {
        public PaginatedCatalogViewModel(int pageIndex, int pageSize, long count, IEnumerable<TEntity> data)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            Count = count;
            Data = data;
        }

        public int PageIndex { get; }

        public int PageSize { get; }

        public long Count { get; }

        public IEnumerable<TEntity> Data { get; }
    }
}