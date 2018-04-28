using System.Threading;
using System.Threading.Tasks;

namespace Enterprise.Library.FileUtility
{
    public interface IFileUtility
    {
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
        Task UploadFileAsync(string folderName, string fileName,
            string base64File, CancellationToken cancellationToken);

        /// <summary>
        ///     read file from hosting web root.
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
        ///     stream file
        /// </returns>
        Task<byte[]> ReadFileAsync(string folderName, string fileName,
            CancellationToken cancellationToken);

        /// <summary>
        ///     Delete file from hosting web root.
        /// </summary>
        /// <param name="folderName">
        ///     folder name to place this files
        /// </param>
        /// <param name="fileName">
        ///     file name with extension
        /// </param>
        void DeleteFile(string folderName, string fileName);
    }
}