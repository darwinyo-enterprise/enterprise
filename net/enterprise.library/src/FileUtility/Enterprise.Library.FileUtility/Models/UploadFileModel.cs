namespace Enterprise.Library.FileUtility.Models
{
    public class UploadFileModel
    {
        /// <summary>
        /// Id will become folder identifier.
        /// this can be guid or int, depends on parent id which is product id, manufacturer id, so on...
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// File name with File Extension
        /// Example :
        /// filename.jpg, so on...
        /// </summary>
        public string FileName { get; set; }

        /// <summary>
        /// file object converted to base64 / HTTP URL File
        /// </summary>
        public string FileUrl { get; set; }
    }
}
