using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Catalog.API.Models;

namespace Catalog.API.ViewModels
{
    /// <summary>
    /// Card Catalog Item View Model
    /// </summary>
    public class CatalogItemViewModel : IImage
    {
        public string CatalogId { get; set; }
        public int Id { get; set; }
        public string ImageUrl { get; set; }
        public string ImageName { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal OverallRating { get; set; }
        public int TotalFavorites { get; set; }
        public int TotalReviews { get; set; }

        public int ManufacturerId { get; set; }
        public int CategoryId { get; set; }
    }
}
