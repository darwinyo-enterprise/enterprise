﻿using Catalog.API.Models;

namespace Catalog.API.ViewModels
{
    public class ProductViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public int ManufacturerId { get; set; }
        public string ManufacturerName { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string ActorId { get; set; }
        public ProductImage[] ProductImages { get; set; }
        public ProductColor[] ProductColors { get; set; }
    }
}