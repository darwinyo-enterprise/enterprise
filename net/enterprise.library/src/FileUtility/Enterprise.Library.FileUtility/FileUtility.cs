using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace Enterprise.Library.FileUtility
{
    public class FileUtility : IFileUtility
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public FileUtility(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }
        /// <summary>
        ///     Responsible for creating file in intended folder dir.
        ///     Note :
        ///     Only for .NET Core
        /// </summary>
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
        public async Task UploadFileAsync(string folderName, string fileName,
            string base64File, CancellationToken cancellationToken)
        {
            var webRootPath = _hostingEnvironment.WebRootPath;
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
        /// read file from hosting web root.
        /// </summary>
        /// <param name="folderName">
        ///     folder name to place this files
        /// </param>
        /// <param name="fileName">
        ///     file name with extension
        /// </param>
        /// <param name="cancellationToken">
        ///     used for cancellation Task
        /// </param>
        /// <returns>
        /// stream file
        /// </returns>
        public async Task<byte[]> ReadFileAsync(string folderName, string fileName, CancellationToken cancellationToken)
        {
            var webRoot = _hostingEnvironment.WebRootPath;
            var path = Path.Combine(webRoot, folderName, fileName);
            return await File.ReadAllBytesAsync(path, cancellationToken);
        }

        /// <summary>
        /// Delete file from hosting web root.
        /// </summary>
        /// <param name="folderName">
        ///     folder name to place this files
        /// </param>
        /// <param name="fileName">
        ///     file name with extension
        /// </param>
        public void DeleteFile(string folderName, string fileName)
        {
            var webRoot = _hostingEnvironment.WebRootPath;

            var dirPath = Path.Combine(webRoot, folderName);
            var path = Path.Combine(dirPath, fileName);

            File.Delete(path);

            if (Directory.GetFiles(dirPath).Length == 0)
            {
                Directory.Delete(dirPath);
            }
        }
    }
}