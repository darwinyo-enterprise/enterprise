using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Catalog.API.Models;
using Enterprise.Library.FileUtility;

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
                    : baseUri + catalogItem.ImageId.ToString();
            });

            return items;
        }

        public static T ChangeUriPlaceholder(T item, string baseUri, bool azureStorageEnabled)
        {
            item.ImageUrl = azureStorageEnabled
                ? baseUri + item.ImageName
                : baseUri + item.ImageId + "/" + item.ImageName;
            return item;
        }

        /// <summary>
        /// Used for make image url to be base64 url, single item single image
        /// </summary>
        /// <param name="item">Model has image</param>
        /// <param name="fileUtility">file utility helper</param>
        /// <param name="folderName">folder group name => Manufacturer, Product, Category</param>
        /// <param name="cancellationToken"></param>
        /// <returns>base64 format image model</returns>
        public static async Task<T> GetImageBase64UrlAsync(T item, IFileUtility fileUtility, string folderName, CancellationToken cancellationToken)
        {
            var imageFileExtension = Path.GetExtension(item.ImageName);

            var buffer = await fileUtility.ReadFileAsync(folderName + "/" + item.ImageId, item.ImageName, cancellationToken);
            item.ImageUrl = "data:image/" + imageFileExtension.Substring(1) + ";base64," + Convert.ToBase64String(buffer);
            return item;
        }

        /// <summary>
        /// Used for make image url to be base64 url which has header id means has multiple images
        /// </summary>
        /// <param name="id">header id => product id</param>
        /// <param name="item">Model has image</param>
        /// <param name="fileUtility">file utility helper</param>
        /// <param name="folderName">folder group name => Manufacturer, Product, Category</param>
        /// <param name="cancellationToken"></param>
        /// <returns>base64 format image model</returns>
        public static async Task<T> GetImageBase64UrlAsync(string id,T item, IFileUtility fileUtility, string folderName, CancellationToken cancellationToken)
        {
            var imageFileExtension = Path.GetExtension(item.ImageName);

            var buffer = await fileUtility.ReadFileAsync(folderName + "/" + id, item.ImageName, cancellationToken);
            item.ImageUrl = "data:image/" + imageFileExtension.Substring(1) + ";base64," + Convert.ToBase64String(buffer);
            return item;
        }
    }
}