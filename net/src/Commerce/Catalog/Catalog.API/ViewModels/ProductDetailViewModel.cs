using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Catalog.API.ViewModels
{
    public class ProductDetailViewModel : ProductViewModel
    {
        public int Sold { get; set; }
        public string LastUpdated { get; set; }
        public int Favorites { get; set; }
        public int Reviews { get; set; }
        public decimal OverallRating { get; set; }
        public int WishlistCount { get; set; }
    }
}
