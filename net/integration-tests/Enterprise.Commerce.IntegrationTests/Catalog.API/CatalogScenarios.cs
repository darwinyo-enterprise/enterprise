using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace Enterprise.Commerce.IntegrationTests.Catalog.API
{
    public class CatalogScenarios
        : CatalogScenarioBase
    {
        [Fact]
        public async Task Get_manufacturer_by_id_response_bad_request_status_code()
        {
            using (var server = CreateServer())
            {
                var response = await server.CreateClient()
                    .GetAsync(Get.ManufacturerById(int.MinValue));

                Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            }
        }

        [Fact]
        public async Task Get_manufacturer_by_id_response_not_found_status_code()
        {
            using (var server = CreateServer())
            {
                var response = await server.CreateClient()
                    .GetAsync(Get.ManufacturerById(int.MaxValue));

                Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            }
        }

        [Fact]
        public async Task Get_manufacturer_by_id_response_ok_status_code()
        {
            var searchedManufacturerId = 1;
            using (var server = CreateServer())
            {
                var response = await server.CreateClient()
                    .GetAsync(Get.ManufacturerById(searchedManufacturerId));
                response.EnsureSuccessStatusCode();
            }
        }

        [Fact]
        public async Task Get_manufacturers_response_ok_status_code()
        {
            using (var server = CreateServer())
            {
                var response = await server.CreateClient()
                    .GetAsync(Get.Manufacturers);

                response.EnsureSuccessStatusCode();
            }
        }


        //[Fact]
        //public async Task Get_catalog_types_response_ok_status_code()
        //{
        //    using (var server = CreateServer())
        //    {
        //        var response = await server.CreateClient()
        //            .GetAsync(Get.Types);

        //        response.EnsureSuccessStatusCode();
        //    }
        //}

        //[Fact]
        //public async Task Get_get_all_catalogitems_and_response_ok_status_code()
        //{
        //    using (var server = CreateServer())
        //    {
        //        var response = await server.CreateClient()
        //            .GetAsync(Get.Items());

        //        response.EnsureSuccessStatusCode();
        //    }
        //}

        //[Fact]
        //public async Task Get_get_catalogitem_by_id_and_response_bad_request_status_code()
        //{
        //    using (var server = CreateServer())
        //    {
        //        var response = await server.CreateClient()
        //            .GetAsync(Get.ItemById(int.MinValue));

        //        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        //    }
        //}

        //[Fact]
        //public async Task Get_get_catalogitem_by_id_and_response_not_found_status_code()
        //{
        //    using (var server = CreateServer())
        //    {
        //        var response = await server.CreateClient()
        //            .GetAsync(Get.ItemById(int.MaxValue));

        //        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        //    }
        //}

        //[Fact]
        //public async Task Get_get_catalogitem_by_id_and_response_ok_status_code()
        //{
        //    using (var server = CreateServer())
        //    {
        //        var response = await server.CreateClient()
        //            .GetAsync(Get.ItemById(1));

        //        response.EnsureSuccessStatusCode();
        //    }
        //}

        //[Fact]
        //public async Task Get_get_catalogitem_by_name_and_response_ok_status_code()
        //{
        //    using (var server = CreateServer())
        //    {
        //        var response = await server.CreateClient()
        //            .GetAsync(Get.ItemByName(".NET"));

        //        response.EnsureSuccessStatusCode();
        //    }
        //}

        //[Fact]
        //public async Task Get_get_filtered_catalog_items_and_response_ok_status_code()
        //{
        //    using (var server = CreateServer())
        //    {
        //        var response = await server.CreateClient()
        //            .GetAsync(Get.Filtered(1, 1));

        //        response.EnsureSuccessStatusCode();
        //    }
        //}

        //[Fact]
        //public async Task Get_get_paginated_catalog_items_and_response_ok_status_code()
        //{
        //    using (var server = CreateServer())
        //    {
        //        const bool paginated = true;
        //        var response = await server.CreateClient()
        //            .GetAsync(Get.Items(paginated));

        //        response.EnsureSuccessStatusCode();
        //    }
        //}

        //[Fact]
        //public async Task Get_get_paginated_catalogitem_by_name_and_response_ok_status_code()
        //{
        //    using (var server = CreateServer())
        //    {
        //        const bool paginated = true;
        //        var response = await server.CreateClient()
        //            .GetAsync(Get.ItemByName(".NET", paginated));

        //        response.EnsureSuccessStatusCode();
        //    }
        //}

        //[Fact]
        //public async Task Get_get_paginated_filtered_catalog_items_and_response_ok_status_code()
        //{
        //    using (var server = CreateServer())
        //    {
        //        const bool paginated = true;
        //        var response = await server.CreateClient()
        //            .GetAsync(Get.Filtered(1, 1, paginated));

        //        response.EnsureSuccessStatusCode();
        //    }
        //}
    }
}