using System;

namespace Catalog.API.Models
{
    public class ProductRating
    {
        public int Id { get; set; }
        public string ProductId { get; set; }
        public string UserId { get; set; }
        public decimal Rate { get; set; }

        public User User { get; set; }
    }
}