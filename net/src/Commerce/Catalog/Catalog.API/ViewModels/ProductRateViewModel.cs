using Catalog.API.Models;

namespace Catalog.API.ViewModels
{
    public class ProductRateViewModel
    {
        public string ProductId { get; set; }
        public decimal Rate { get; set; }
        public User User { get; set; }
    }
}