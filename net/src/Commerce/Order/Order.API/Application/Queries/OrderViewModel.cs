using System;
using System.Collections.Generic;

namespace Order.API.Application.Queries
{
    public class Orderitem
    {
        public string Productname { get; set; }
        public int Units { get; set; }
        public double Unitprice { get; set; }
        public string Pictureurl { get; set; }
    }

    public class Order
    {
        public int Ordernumber { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string Zipcode { get; set; }
        public string Country { get; set; }
        public List<Orderitem> Orderitems { get; set; }
        public decimal Total { get; set; }
    }

    public class OrderSummary
    {
        public int Ordernumber { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public double Total { get; set; }
    }

    public class CardType
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}