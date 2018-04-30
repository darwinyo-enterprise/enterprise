using System.Collections.Generic;

namespace Catalog.API.Models
{
    public class User
    {
        /// <summary>
        ///     Default Implementation of Microsoft Identity
        /// </summary>
        public string Id { get; set; }

        public string Name { get; set; }

        public ICollection<ProductRating> ProductRatings { get; set; }
    }
}