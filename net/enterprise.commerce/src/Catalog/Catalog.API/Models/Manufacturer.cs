using System;

namespace Catalog.API.Models
{
    public class Manufacturer
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        /// <summary>
        ///     Image Url can be through http or base64.
        ///     Front end will feed this by base64 to save.
        ///     File will be stored into filestream, after saved this will be altered to http url.
        /// </summary>
        public string ImageUrl { get; set; }
    }
}
