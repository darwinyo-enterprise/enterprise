using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Catalog.API.Models
{
    /// <summary>
    /// All entity that has Image on it should implement this interface
    /// </summary>
    public interface IImage
    {
        int Id { get; set; }
        /// <summary>
        ///     Image Url is base64.
        ///     Front end will feed this by base64 to save.
        /// </summary>
        string ImageUrl { get; set; }

        /// <summary>
        ///     Image Name with extension.
        /// </summary>
        string ImageName { get; set; }
    }
}
