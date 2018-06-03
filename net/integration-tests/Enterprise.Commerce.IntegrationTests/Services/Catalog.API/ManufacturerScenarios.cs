//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using System.Net.Http;
//using System.Text;
//using System.Threading.Tasks;
//using Catalog.API.Infrastructure;
//using Catalog.API.Models;
//using Catalog.API.ViewModels;
//using Enterprise.Commerce.IntegrationTests.Attributes;
//using Microsoft.AspNetCore.Hosting;
//using Microsoft.AspNetCore.TestHost;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.DependencyInjection;
//using Newtonsoft.Json;
//using Xunit;

//namespace Enterprise.Commerce.IntegrationTests.Services.Catalog.API
//{
//    [TestCaseOrderer(TestCollectionOrderer.TypeName, TestCollectionOrderer.AssembyName)]
//    public class ManufacturerScenarios : CatalogScenarioBase
//    {
//        private Manufacturer GetTestManufacturer()
//        {
//            return new Manufacturer
//            {
//                Description = "Enterprise",
//                ImageUrl =
//                    "data:image/png;base64,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",
//                ImageName = "Enterprise.jpg",
//                Name = "Enterprise Company"
//            };
//        }

//        private async Task<Manufacturer> SeedTestManufacturerAsync(CatalogContext ctx, TestServer server)
//        {
//            var verifyManufacturer =
//                await ctx.Manufacturers.SingleOrDefaultAsync(x => x.Name == GetTestManufacturer().Name);
//            if (verifyManufacturer != null)
//            {
//                ctx.Manufacturers.Remove(verifyManufacturer);
//                await ctx.SaveChangesAsync();
//            }

//            var content = new StringContent(JsonConvert.SerializeObject(GetTestManufacturer()), Encoding.UTF8,
//                "application/json");

//            var response = await server.CreateClient()
//                .PostAsync(Post.AddManufacturer, content);

//            response.EnsureSuccessStatusCode();

//            var insertedManufacturer =
//                await ctx.Manufacturers.SingleOrDefaultAsync(x => x.Name == GetTestManufacturer().Name);

//            return insertedManufacturer;
//        }

//        [Fact]
//        [TestPriority(7)]
//        public async Task Add_manufacturer_response_ok_status_code_should_add_file_in_directory()
//        {
//            using (var server = CreateServer())
//            {
//                var ctx = server.Host.Services.GetRequiredService<CatalogContext>();

//                var verifyManufacturer =
//                    await ctx.Manufacturers.SingleOrDefaultAsync(x => x.Name == GetTestManufacturer().Name);
//                if (verifyManufacturer != null)
//                {
//                    ctx.Manufacturers.Remove(verifyManufacturer);
//                    await ctx.SaveChangesAsync();
//                }

//                var content = new StringContent(JsonConvert.SerializeObject(GetTestManufacturer()), Encoding.UTF8,
//                    "application/json");

//                var response = await server.CreateClient()
//                    .PostAsync(Post.AddManufacturer, content);

//                response.EnsureSuccessStatusCode();

//                var hostingEnvironment = server.Host.Services.GetRequiredService<IHostingEnvironment>();

//                var insertedManufacturer =
//                    await ctx.Manufacturers.SingleOrDefaultAsync(x => x.Name == GetTestManufacturer().Name);
//                var targetDir = hostingEnvironment.WebRootPath + "\\Manufacturer\\" + insertedManufacturer.Id + "\\" +
//                                insertedManufacturer.ImageName;

//                Assert.True(File.Exists(targetDir));
//            }
//        }


//        [Fact]
//        [TestPriority(8)]
//        public async Task Add_manufacturer_response_ok_status_code_should_persisted_in_db()
//        {
//            using (var server = CreateServer())
//            {
//                var ctx = server.Host.Services.GetRequiredService<CatalogContext>();

//                var verifyManufacturer =
//                    await ctx.Manufacturers.SingleOrDefaultAsync(x => x.Name == GetTestManufacturer().Name);
//                if (verifyManufacturer != null)
//                {
//                    ctx.Manufacturers.Remove(verifyManufacturer);
//                    await ctx.SaveChangesAsync();
//                }

//                var content = new StringContent(JsonConvert.SerializeObject(GetTestManufacturer()), Encoding.UTF8,
//                    "application/json");

//                var response = await server.CreateClient()
//                    .PostAsync(Post.AddManufacturer, content);

//                response.EnsureSuccessStatusCode();

//                var insertedManufacturer =
//                    await ctx.Manufacturers.SingleOrDefaultAsync(x => x.Name == GetTestManufacturer().Name);

//                Assert.NotNull(insertedManufacturer);
//            }
//        }

//        [Fact]
//        [TestPriority(11)]
//        public async Task Delete_manufacturer_should_delete_file_and_folder_in_directory()
//        {
//            using (var server = CreateServer())
//            {
//                var ctx = server.Host.Services.GetRequiredService<CatalogContext>();
//                var manufacturerToDelete = await SeedTestManufacturerAsync(ctx, server);

//                await server.CreateClient()
//                    .DeleteAsync(Delete.DeleteManufacturer(manufacturerToDelete.Id));

//                var hostingEnvironment = server.Host.Services.GetRequiredService<IHostingEnvironment>();

//                var targetDir = hostingEnvironment.WebRootPath + "\\Manufacturer\\" + manufacturerToDelete.Id + "\\" +
//                                manufacturerToDelete.ImageName;

//                Assert.False(File.Exists(targetDir));
//            }
//        }


//        [Fact]
//        [TestPriority(12)]
//        public async Task Delete_manufacturer_should_properly_delete_record_in_db()
//        {
//            using (var server = CreateServer())
//            {
//                var ctx = server.Host.Services.GetRequiredService<CatalogContext>();
//                var manufacturerToDelete = await SeedTestManufacturerAsync(ctx, server);

//                await server.CreateClient()
//                    .DeleteAsync(Delete.DeleteManufacturer(manufacturerToDelete.Id));

//                var deletedManufacturer =
//                    await ctx.Manufacturers.SingleOrDefaultAsync(x => x.Name == manufacturerToDelete.Name);
//                Assert.Null(deletedManufacturer);
//            }
//        }

//        [Fact]
//        [TestPriority(3)]
//        public async Task Get_manufacturer_by_id_response_ok_status_code()
//        {
//            var searchedManufacturerId = 1;
//            using (var server = CreateServer())
//            {
//                var response = await server.CreateClient()
//                    .GetAsync(Get.ManufacturerById(searchedManufacturerId));
//                response.EnsureSuccessStatusCode();
//            }
//        }

//        [Fact]
//        [TestPriority(1)]
//        public async Task Get_manufacturer_response_ok_status_code_should_return_all_manufacturers()
//        {
//            using (var server = CreateServer())
//            {
//                var response = await server.CreateClient()
//                    .GetAsync(Get.Manufacturers);
//                response.EnsureSuccessStatusCode();
//                var result =
//                    JsonConvert.DeserializeObject<List<Manufacturer>>(await response.Content.ReadAsStringAsync());

//                var ctx = server.Host.Services.GetRequiredService<CatalogContext>();

//                var actual = await ctx.Manufacturers.ToListAsync();
//                Assert.Equal(actual.Count, result.Count);
//            }
//        }

//        [Fact]
//        [TestPriority(2)]
//        public async Task Get_manufacturer_response_ok_status_code_with_http_urls()
//        {
//            using (var server = CreateServer())
//            {
//                var response = await server.CreateClient()
//                    .GetAsync(Get.Manufacturers);
//                response.EnsureSuccessStatusCode();
//                var result =
//                    JsonConvert.DeserializeObject<List<Manufacturer>>(await response.Content.ReadAsStringAsync());

//                Assert.Contains("http", result[0].ImageUrl);
//            }
//        }

//        [Fact]
//        [TestPriority(6)]
//        public async Task Get_manufacturer_image_by_id_response_file_result()
//        {
//            using (var server = CreateServer())
//            {
//                var ctx = server.Host.Services.GetRequiredService<CatalogContext>();
//                var actual = await ctx.Manufacturers.FirstOrDefaultAsync();

//                var response = await server.CreateClient()
//                    .GetAsync(Get.ManufacturerImageById(actual.Id.ToString()));
//                Assert.IsType<StreamContent>(response.Content);
//            }
//        }

//        [Fact]
//        [TestPriority(4)]
//        public async Task Get_manufacturer_by_id_response_ok_status_code_with_correct_result()
//        {
//            using (var server = CreateServer())
//            {
//                var ctx = server.Host.Services.GetRequiredService<CatalogContext>();
//                var actual = await ctx.Manufacturers.FirstOrDefaultAsync();

//                var response = await server.CreateClient()
//                    .GetAsync(Get.ManufacturerById(actual.Id));

//                response.EnsureSuccessStatusCode();

//                var result = JsonConvert.DeserializeObject<Manufacturer>(await response.Content.ReadAsStringAsync());

//                Assert.Equal(actual.Name, result.Name);
//                Assert.Equal(actual.Description, result.Description);
//                Assert.Equal(actual.ImageName, result.ImageName);
//                Assert.Equal(actual.Id, result.Id);
//            }
//        }

//        [Fact]
//        [TestPriority(5)]
//        public async Task Get_manufacturer_by_id_response_ok_status_code_return_base64_instead_of_http_url()
//        {
//            using (var server = CreateServer())
//            {
//                var ctx = server.Host.Services.GetRequiredService<CatalogContext>();
//                var actual = await ctx.Manufacturers.FirstOrDefaultAsync();

//                var response = await server.CreateClient()
//                    .GetAsync(Get.ManufacturerById(actual.Id));

//                response.EnsureSuccessStatusCode();

//                var result = JsonConvert.DeserializeObject<Manufacturer>(await response.Content.ReadAsStringAsync());

//                Assert.Equal(actual.Name, result.Name);
//                Assert.Equal(actual.Description, result.Description);
//                Assert.Equal(actual.ImageName, result.ImageName);
//                Assert.Equal(actual.Id, result.Id);
//                Assert.Contains("base64", result.ImageUrl);
//            }
//        }


//        [Fact]
//        [TestPriority(10)]
//        public async Task Update_manufacturer_response_ok_status_code_should_persisted_in_db()
//        {
//            using (var server = CreateServer())
//            {
//                var ctx = server.Host.Services.GetRequiredService<CatalogContext>();
//                var manufacturerToUpdate = await ctx.Manufacturers.FirstOrDefaultAsync();

//                manufacturerToUpdate.Name = "Test";
//                manufacturerToUpdate.Description = "Test1";
//                manufacturerToUpdate.ImageName = "test1.png";
//                manufacturerToUpdate.ImageUrl = GetTestManufacturer().ImageUrl;

//                var content = new StringContent(JsonConvert.SerializeObject(manufacturerToUpdate), Encoding.UTF8,
//                    "application/json");

//                var response = await server.CreateClient()
//                    .PutAsync(Put.UpdateManufacturer(manufacturerToUpdate.Id), content);

//                response.EnsureSuccessStatusCode();

//                var insertedManufacturer =
//                    await ctx.Manufacturers.SingleOrDefaultAsync(x => x.Name == manufacturerToUpdate.Name);
//                Assert.NotNull(insertedManufacturer);
//            }
//        }

//        [Fact]
//        [TestPriority(9)]
//        public async Task Update_manufacturer_response_ok_status_code_should_replace_file_in_directory()
//        {
//            using (var server = CreateServer())
//            {
//                var ctx = server.Host.Services.GetRequiredService<CatalogContext>();
//                var manufacturerToUpdate = await ctx.Manufacturers.FirstOrDefaultAsync();

//                manufacturerToUpdate.Description = "Test";
//                manufacturerToUpdate.ImageName = "test.png";
//                manufacturerToUpdate.ImageUrl = GetTestManufacturer().ImageUrl;

//                var content = new StringContent(JsonConvert.SerializeObject(manufacturerToUpdate), Encoding.UTF8,
//                    "application/json");

//                var response = await server.CreateClient()
//                    .PutAsync(Put.UpdateManufacturer(manufacturerToUpdate.Id), content);

//                response.EnsureSuccessStatusCode();

//                var hostingEnvironment = server.Host.Services.GetRequiredService<IHostingEnvironment>();

//                var insertedManufacturer =
//                    await ctx.Manufacturers.SingleOrDefaultAsync(x => x.Name == manufacturerToUpdate.Name);
//                var targetDir = hostingEnvironment.WebRootPath + "\\Manufacturer\\" + insertedManufacturer.Id + "\\" +
//                                insertedManufacturer.ImageName;

//                Assert.True(File.Exists(targetDir));
//            }
//        }


//        [Fact]
//        [TestPriority(13)]
//        public async Task Get_manufacturer_list_response_ok_status_code_and_correct_pagination_info_should_return_paginated_item()
//        {
//            using (var server = CreateServer())
//            {
//                var response = await server.CreateClient()
//                    .GetAsync(Get.ManufacturerListPaginatedItem());
//                response.EnsureSuccessStatusCode();
//                var result =
//                    JsonConvert.DeserializeObject<PaginatedListViewModel<ItemViewModel>>(await response.Content.ReadAsStringAsync());

//                var ctx = server.Host.Services.GetRequiredService<CatalogContext>();

//                var actual = await ctx.Manufacturers.ToListAsync();
//                Assert.Equal(actual.Count, result.Count);
//                Assert.Equal(Get.PageIndex, result.PageIndex);
//                Assert.Equal(Get.PageSize, result.PageSize);
//                Assert.Equal(Get.PageSize,result.ListData.Count());
//            }
//        }

//    }
//}