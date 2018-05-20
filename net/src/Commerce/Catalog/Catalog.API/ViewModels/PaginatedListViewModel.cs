using System.Collections.Generic;

namespace Catalog.API.ViewModels
{
    /// <summary>
    ///     for admin list management items
    /// </summary>
    /// <typeparam name="T">
    ///     item Object
    /// </typeparam>
    public class PaginatedListViewModel<T> where T : ItemViewModel
    {
        public PaginatedListViewModel(int pageIndex, int pageSize, long count, IEnumerable<T> listData)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            Count = count;
            ListData = listData;
        }

        public IEnumerable<T> ListData { get; set; }

        public int PageIndex { get; }

        public int PageSize { get; }

        public long Count { get; }
    }
}