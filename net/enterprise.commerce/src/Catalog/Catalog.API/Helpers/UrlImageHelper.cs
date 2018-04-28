using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Catalog.API.Models;

namespace Catalog.API.Helpers
{
    public class UrlImageHelper<T> where T: IImage
    {
        private static List<T> ChangeUriPlaceholder(List<T> items,string baseUri,bool azureStorageEnabled)
        {
            items.ForEach(catalogItem =>
            {
                catalogItem.ImageUrl = azureStorageEnabled
                    ? baseUri + catalogItem.ImageName
                    : baseUri + catalogItem.Id.ToString();
            });

            return items;
        }
    }
}
