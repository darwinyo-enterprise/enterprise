using System.IO;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Enterprise.Library.FileUtility
{
    public class FileUtility
    {
        /// <summary>
        /// Responsible for creating file in intended folder dir.
        /// 
        /// Note :
        /// Only for .NET Core
        /// </summary>
        /// <param name="hostingEnvironment">
        /// Provides information about the web hosting environment an application is running in.
        /// </param>
        /// <param name="folderName">
        /// folder name to place this files
        /// </param>
        /// <param name="file">
        /// file upload
        /// </param>
        public static void UploadFile(IHostingEnvironment hostingEnvironment, string folderName, IFormFile file)
        {
            string webRootPath = hostingEnvironment.WebRootPath;
            string newPath = Path.Combine(webRootPath, folderName);
            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }
            if (file.Length > 0)
            {
                string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                string fullPath = Path.Combine(newPath, fileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
            }
        }
    }
}
