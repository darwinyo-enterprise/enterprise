namespace Catalog.API.Models
{
    public class Manufacturer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        /// <summary>
        ///     Image Url is base64.
        ///     Front end will feed this by base64 to save.
        /// </summary>
        public string ImageUrl { get; set; }

        /// <summary>
        ///     Image Name with extension.
        /// </summary>
        public string ImageName { get; set; }

        public byte[] Timestamp { get; set; }
    }
}