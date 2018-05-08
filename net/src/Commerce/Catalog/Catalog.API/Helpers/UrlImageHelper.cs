using System.Collections.Generic;
using Catalog.API.Models;

namespace Catalog.API.Helpers
{
    public class UrlImageHelper<T> where T : IImage
    {
        public static List<T> ChangeUriPlaceholder(List<T> items, string baseUri, bool azureStorageEnabled)
        {
            items.ForEach(catalogItem =>
            {
                catalogItem.ImageUrl = azureStorageEnabled
                    ? baseUri + catalogItem.ImageName
                    : baseUri + catalogItem.Id.ToString();
            });

            return items;
        }
        public static T ChangeUriPlaceholder(T item, string baseUri, bool azureStorageEnabled)
        {
                item.ImageUrl = azureStorageEnabled
                    ? baseUri + item.ImageName
                    : baseUri + item.Id.ToString();
            return item;
        }
    }
}