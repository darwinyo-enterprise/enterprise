using System;

namespace Catalog.API.Models
{
    public class ProductRating
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public decimal Rate { get; set; }
    }
}