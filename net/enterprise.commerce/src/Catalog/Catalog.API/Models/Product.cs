using System;
using System.Collections.Generic;
using Catalog.API.Exceptions;

namespace Catalog.API.Models
{
    public class Product
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal OverallRating { get; set; }
        public int TotalFavorites { get; set; }
        public int TotalReviews { get; set; }
        public string Description { get; set; }

        public DateTime? LastUpdated { get; set; }
        public string LastUpdatedBy { get; set; }
        
        // Quantity in stock
        public int AvailableStock { get; set; }

        public int ManufacturerId { get; set; }
        public int CategoryId { get; set; }

        public byte[] Timestamp { get; set; }
        public Manufacturer Manufacturer { get; set; }
        public Category Category { get; set; }

        public ICollection<ProductImage> ProductImages { get; set; }
        public ICollection<ProductColor> ProductColors { get; set; }
        public ICollection<ProductRating> ProductRatings { get; set; }
        
        /// <summary>
        ///     Decrements the quantity of a particular item in inventory and ensures the restockThreshold hasn't
        ///     been breached. If so, a RestockRequest is generated in CheckThreshold.
        ///     If there is sufficient stock of an item, then the integer returned at the end of this call should be the same as
        ///     quantityDesired.
        ///     In the event that there is not sufficient stock available, the method will remove whatever stock is available and
        ///     return that quantity to the client.
        ///     In this case, it is the responsibility of the client to determine if the amount that is returned is the same as
        ///     quantityDesired.
        ///     It is invalid to pass in a negative number.
        /// </summary>
        /// <param name="quantityDesired"></param>
        /// <returns>int: Returns the number actually removed from stock. </returns>
        public int RemoveStock(int quantityDesired)
        {
            if (AvailableStock == 0) throw new CatalogDomainException($"Empty stock, product item {Name} is sold out");

            if (quantityDesired <= 0)
                throw new CatalogDomainException($"Item units desired should be greater than cero");

            var removed = Math.Min(quantityDesired, AvailableStock);

            AvailableStock -= removed;

            return removed;
        }

        /// <summary>
        ///     Increments the quantity of a particular item in inventory.
        ///     <param name="quantity"></param>
        ///     <returns>int: Returns the quantity that has been added to stock</returns>
        /// </summary>
        public int AddStock(int quantity)
        {
            AvailableStock += quantity;

            return quantity;
        }

        /// <summary>
        ///     Update Rate Star.
        ///     to update, we need to insert to db for details...
        /// </summary>
        /// <param name="reviewsCount">
        ///     count reviews. how many persons has rated.
        /// </param>
        /// <param name="rate">
        ///     rate to add
        /// </param>
        /// <returns>
        ///     updated product rate
        /// </returns>
        public decimal UpdateRate(int reviewsCount, decimal rate)
        {
            var totalRateBefore = OverallRating * (reviewsCount - 1);

            var totalRateCurrent = totalRateBefore + rate;

            OverallRating = totalRateCurrent / reviewsCount;
            return OverallRating;
        }
    }
}