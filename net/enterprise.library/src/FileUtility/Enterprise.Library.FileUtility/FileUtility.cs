using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace Enterprise.Library.FileUtility
{
    public class FileUtility
    {
        /// <summary>
        ///     Responsible for creating file in intended folder dir.
        ///     Note :
        ///     Only for .NET Core
        /// </summary>
        /// <param name="hostingEnvironment">
        ///     Provides information about the web hosting environment an application is running in.
        /// </param>
        /// <param name="folderName">
        ///     folder name to place this files
        /// </param>
        /// <param name="fileName">
        ///     file name with extension
        /// </param>
        /// <param name="base64File">
        ///     file object converted to base 64 (in front-end)
        /// </param>
        /// <param name="cancellationToken">
        ///     used for cancellation Task
        /// </param>
        public static async Task UploadFileAsync(IHostingEnvironment hostingEnvironment, string folderName, string fileName, string base64File, CancellationToken cancellationToken)
        {
            var webRootPath = hostingEnvironment.WebRootPath;
            var newPath = Path.Combine(webRootPath, folderName);

            if (!Directory.Exists(newPath)) Directory.CreateDirectory(newPath);
            if (!string.IsNullOrEmpty(base64File))
            {
                var fullPath = Path.Combine(newPath, fileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    var file = Convert.FromBase64String(base64File);
                    await stream.WriteAsync(file, 0, file.Length, cancellationToken);
                }
            }
        }

        /// <summary>
        /// used to get mime type by extension file
        /// </summary>
        /// <param name="extension">
        /// extension file
        /// example :
        /// .png, .jpg, .gif, so on...
        /// </param>
        /// <returns>
        /// mime type
        /// </returns>
        public static string GetImageMimeTypeFromImageFileExtension(string extension)
        {
            string mimetype;

            switch (extension)
            {
                case ".png":
                    mimetype = "image/png";
                    break;
                case ".gif":
                    mimetype = "image/gif";
                    break;
                case ".jpg":
                case ".jpeg":
                    mimetype = "image/jpeg";
                    break;
                case ".bmp":
                    mimetype = "image/bmp";
                    break;
                case ".tiff":
                    mimetype = "image/tiff";
                    break;
                case ".wmf":
                    mimetype = "image/wmf";
                    break;
                case ".jp2":
                    mimetype = "image/jp2";
                    break;
                case ".svg":
                    mimetype = "image/svg+xml";
                    break;
                default:
                    mimetype = "application/octet-stream";
                    break;
            }

            return mimetype;
        }

    }
}