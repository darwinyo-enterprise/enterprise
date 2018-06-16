using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;

namespace Order.API.Application.Queries
{
    public class OrderQueries
        : IOrderQueries
    {
        private readonly string _connectionString = string.Empty;

        public OrderQueries(string constr)
        {
            _connectionString = !string.IsNullOrWhiteSpace(constr)
                ? constr
                : throw new ArgumentNullException(nameof(constr));
        }


        public async Task<Order> GetOrderAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var result = await connection.QueryAsync<dynamic>(
                    @"select o.[Id] as ordernumber,o.OrderDate as date, o.Description as description,
                        o.Address_City as city, o.Address_Country as country, o.Address_State as state, o.Address_Street as street, o.Address_ZipCode as zipcode,
                        os.Name as status, 
                        oi.ProductName as productname, oi.Units as units, oi.UnitPrice as unitprice, oi.PictureUrl as pictureurl
                        FROM Ordering.Orders o
                        LEFT JOIN Ordering.OrderItems oi ON o.Id = oi.orderid 
                        LEFT JOIN Ordering.OrderStatus os on o.OrderStatusId = os.Id
                        WHERE o.Id=@id"
                    , new {id}
                );

                if (result.AsList().Count == 0)
                    throw new KeyNotFoundException();

                return MapOrderItems(result);
            }
        }

        public async Task<IEnumerable<OrderSummary>> GetOrdersAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                return await connection.QueryAsync<OrderSummary>(
                    @"SELECT o.[Id] as ordernumber,o.[OrderDate] as [date],os.[Name] as [status],SUM(oi.units*oi.unitprice) as total
                     FROM [Ordering].[Orders] o
                     LEFT JOIN[Ordering].[OrderItems] oi ON  o.Id = oi.orderid 
                     LEFT JOIN[Ordering].[OrderStatus] os on o.OrderStatusId = os.Id                     
                     GROUP BY o.[Id], o.[OrderDate], os.[Name] 
                     ORDER BY o.[Id]");
            }
        }

        public async Task<IEnumerable<CardType>> GetCardTypesAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                return await connection.QueryAsync<CardType>("SELECT * FROM Ordering.CardTypes");
            }
        }

        private Order MapOrderItems(dynamic result)
        {
            var order = new Order
            {
                Ordernumber = result[0].ordernumber,
                Date = result[0].date,
                Status = result[0].status,
                Description = result[0].description,
                Street = result[0].street,
                City = result[0].city,
                Zipcode = result[0].zipcode,
                Country = result[0].country,
                Orderitems = new List<Orderitem>(),
                Total = 0
            };

            foreach (var item in result)
            {
                var orderitem = new Orderitem
                {
                    Productname = item.productname,
                    Units = item.units,
                    Unitprice = (double) item.unitprice,
                    Pictureurl = item.pictureurl
                };

                order.Total += item.units * item.unitprice;
                order.Orderitems.Add(orderitem);
            }

            return order;
        }
    }
}