using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Catalog.API.Extensions;
using Catalog.API.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Polly;

namespace Catalog.API.Infrastructure
{
    public class CatalogContextSeed
    {
        private IHostingEnvironment _env;
        public async Task SeedAsync(CatalogContext context, IHostingEnvironment env, IOptions<CatalogSettings> settings,
            ILogger<CatalogContextSeed> logger)
        {
            _env = env;
            var policy = CreatePolicy(logger, nameof(CatalogContextSeed));

            await policy.ExecuteAsync(async () =>
            {
                var useCustomizationData = settings.Value.UseCustomizationData;
                var contentRootPath = env.ContentRootPath;
                if (!context.Manufacturers.Any())
                {
                    GetPictures(contentRootPath, _env.WebRootPath + "/Manufacturer", "Manufacturer.zip");
                    await context.Manufacturers.AddRangeAsync(useCustomizationData
                        ? GetManufacturerFromFile(contentRootPath, logger)
                        : GetPreconfiguredManufacturer());

                    await context.SaveChangesAsync();



                    await context.Manufacturers.ToListAsync();
                }

                if (!context.Categories.Any())
                {
                    GetPictures(contentRootPath, _env.WebRootPath + "/Category", "Category.zip");

                    await context.Categories.AddRangeAsync(useCustomizationData
                        ? GetCategoryFromFile(contentRootPath, logger)
                        : GetPreconfiguredCategory());

                    await context.SaveChangesAsync();

                    await context.Categories.ToListAsync();
                }

                if (!context.Users.Any())
                {
                    await context.Users.AddRangeAsync(useCustomizationData
                        ? GetUserFromFile(contentRootPath, logger)
                        : GetPreconfiguredUser());

                    await context.SaveChangesAsync();

                    await context.Users.ToListAsync();
                }

                if (!context.Products.Any())
                {
                    await context.Products.AddRangeAsync(useCustomizationData
                        ? GetProductFromFile(contentRootPath, logger)
                        : GetPreconfiguredProduct());

                    await context.SaveChangesAsync();

                    await context.Products.ToListAsync();
                }

                if (!context.ProductColors.Any())
                {
                    await context.ProductColors.AddRangeAsync(useCustomizationData
                        ? GetProductColorFromFile(contentRootPath, logger)
                        : GetPreconfiguredProductColor());

                    await context.SaveChangesAsync();

                    await context.ProductColors.ToListAsync();
                }

                if (!context.ProductRatings.Any())
                {
                    await context.ProductRatings.AddRangeAsync(useCustomizationData
                        ? GetProductRatingFromFile(contentRootPath, logger)
                        : GetPreconfiguredProductRating());

                    await context.SaveChangesAsync();

                    await context.ProductRatings.ToListAsync();
                }

                if (!context.ProductImages.Any())
                {
                    await context.ProductImages.AddRangeAsync(useCustomizationData
                        ? GetProductImageFromFile(contentRootPath, logger)
                        : GetPreconfiguredProductImage());

                    await context.SaveChangesAsync();

                    await context.ProductRatings.ToListAsync();
                }
            });
        }

        private Policy CreatePolicy(ILogger<CatalogContextSeed> logger, string prefix, int retries = 3)
        {
            return Policy.Handle<SqlException>().WaitAndRetryAsync(
                retries,
                retry => TimeSpan.FromSeconds(5),
                (exception, timeSpan, retry, ctx) =>
                {
                    logger.LogTrace(
                        $"[{prefix}] Exception {exception.GetType().Name} with message ${exception.Message} detected on attempt {retry} of {retries}");
                }
            );
        }

        #region Manufacturer

        private IEnumerable<Manufacturer> GetManufacturerFromFile(string contentRootPath,
            ILogger<CatalogContextSeed> logger)
        {
            var csvFileManufacturers = Path.Combine(contentRootPath, "Setup", "Manufacturer.csv");

            if (!File.Exists(csvFileManufacturers)) return GetPreconfiguredManufacturer();

            string[] csvheaders;
            try
            {
                string[] requiredHeaders = { "name", "description", "imagename" };
                csvheaders = GetHeaders(csvFileManufacturers, requiredHeaders);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return GetPreconfiguredManufacturer();
            }

            return File.ReadAllLines(csvFileManufacturers)
                .Skip(1) // skip header row
                .Select(row => Regex.Split(row, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"))
                .SelectTry(x =>
                {
                    PlacePictureById(x, csvheaders, _env.WebRootPath + "/Manufacturer");
                    return CreateManufacturer(x, csvheaders);
                })
                .OnCaughtException(ex =>
                {
                    logger.LogError(ex.Message);
                    return null;
                })
                .Where(x => x != null);
        }

        private Manufacturer CreateManufacturer(string[] column, string[] headers)
        {
            var name = column[Array.IndexOf(headers, "name")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("Manufacturer Name is empty");

            var description = column[Array.IndexOf(headers, "description")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("Manufacturer Description is empty");

            var imageName = column[Array.IndexOf(headers, "imagename")].Trim('"').Trim();
            if (string.IsNullOrEmpty(imageName)) throw new Exception("Manufacturer image name is empty");

            return new Manufacturer
            {
                Name = name,
                Description = description,
                ImageName = imageName
            };
        }

        private IEnumerable<Manufacturer> GetPreconfiguredManufacturer()
        {
            return new List<Manufacturer>
            {
                new Manufacturer {Name = "Microsoft", Description = "None", ImageName = "Microsoft.png"},
                new Manufacturer {Name = "Asus", Description = "None",  ImageName = "Asus.png"},
                new Manufacturer {Name = "Apple", Description = "None",  ImageName = "Apple.png"},
                new Manufacturer {Name = "Google", Description = "None",  ImageName = "Google.png"},
                new Manufacturer {Name = "Docker", Description = "None",  ImageName = "Docker.png"},
                new Manufacturer {Name = "Sony", Description = "None",  ImageName = "Sony.png"}
            };
        }

        #endregion

        #region User

        private IEnumerable<User> GetUserFromFile(string contentRootPath,
            ILogger<CatalogContextSeed> logger)
        {
            var csvFileUsers = Path.Combine(contentRootPath, "Setup", "User.csv");

            if (!File.Exists(csvFileUsers)) return GetPreconfiguredUser();

            string[] csvheaders;
            try
            {
                string[] requiredHeaders = { "id", "name" };
                csvheaders = GetHeaders(csvFileUsers, requiredHeaders);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return GetPreconfiguredUser();
            }

            return File.ReadAllLines(csvFileUsers)
                .Skip(1) // skip header row
                .Select(row => Regex.Split(row, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"))
                .SelectTry(x => CreateUser(x, csvheaders))
                .OnCaughtException(ex =>
                {
                    logger.LogError(ex.Message);
                    return null;
                })
                .Where(x => x != null);
        }

        private User CreateUser(string[] column, string[] headers)
        {
            var id = column[Array.IndexOf(headers, "id")].Trim('"').Trim();
            if (string.IsNullOrEmpty(id)) throw new Exception($"user id is empty");

            var name = column[Array.IndexOf(headers, "name")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("user Name is empty");

            return new User
            {
                Name = name,
                Id = id
            };
        }

        private IEnumerable<User> GetPreconfiguredUser()
        {
            return new List<User>
            {
                new User {Name = "Darwin", Id = "1"},
                new User {Name = "Eric", Id = "2"},
                new User {Name = "Musk", Id = "3"},
                new User {Name = "Bill", Id = "4"},
                new User {Name = "Albert", Id = "5"}
            };
        }

        #endregion

        #region Category

        private IEnumerable<Category> GetCategoryFromFile(string contentRootPath,
            ILogger<CatalogContextSeed> logger)
        {
            var csvFileCategorys = Path.Combine(contentRootPath, "Setup", "Category.csv");

            if (!File.Exists(csvFileCategorys)) return GetPreconfiguredCategory();

            string[] csvheaders;
            try
            {
                string[] requiredHeaders = { "name", "description", "imageid" };
                csvheaders = GetHeaders(csvFileCategorys, requiredHeaders);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return GetPreconfiguredCategory();
            }

            return File.ReadAllLines(csvFileCategorys)
                .Skip(1) // skip header row
                .Select(row => Regex.Split(row, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"))
                .SelectTry(x =>
                {
                    PlacePictureById(x, csvheaders, "Category");
                    return CreateCategory(x, csvheaders);
                })
                .OnCaughtException(ex =>
                {
                    logger.LogError(ex.Message);
                    return null;
                })
                .Where(x => x != null);
        }

        private Category CreateCategory(string[] column, string[] headers)
        {
            var name = column[Array.IndexOf(headers, "name")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("catalog Brand Name is empty");

            var description = column[Array.IndexOf(headers, "description")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("catalog Brand Description is empty");

            var imageName = column[Array.IndexOf(headers, "imageid")].Trim('"').Trim();
            if (string.IsNullOrEmpty(imageName)) throw new Exception("catalog Brand image name is empty");

            return new Category
            {
                Name = name,
                Description = description,
                ImageName = imageName
            };
        }

        private IEnumerable<Category> GetPreconfiguredCategory()
        {
            return new List<Category>
            {
                new Category {Name = "Phone", Description = "None",  ImageName = "Phone.png"},
                new Category {Name = "Software", Description = "None",  ImageName = "Software.png"},
                new Category {Name = "Laptop", Description = "None",  ImageName = "Laptop.png"},
                new Category {Name = "Console", Description = "None", ImageName = "Console.png"},
                new Category {Name = "Tablet", Description = "None",  ImageName = "Tablet.png"}
            };
        }

        #endregion

        #region Product

        private IEnumerable<Product> GetProductFromFile(string contentRootPath,
            ILogger<CatalogContextSeed> logger)
        {
            var csvFileProducts = Path.Combine(contentRootPath, "Setup", "Product.csv");

            if (!File.Exists(csvFileProducts)) return GetPreconfiguredProduct();

            string[] csvheaders;
            try
            {
                string[] requiredHeaders =
                {
                    "id", "name", "price", "overallrating", "totalfavorites", "totalreviews", "description",
                    "lastupdated", "lastupdatedby", "availablestock", "manufacturerid", "categoryid"
                };
                csvheaders = GetHeaders(csvFileProducts, requiredHeaders);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return GetPreconfiguredProduct();
            }

            var result = File.ReadAllLines(csvFileProducts)
                .Skip(1) // skip header row
                .Select(row => Regex.Split(row, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"))
                .SelectTry(x => CreateProduct(x, csvheaders))
                .OnCaughtException(ex =>
                {
                    logger.LogError(ex.Message);
                    return null;
                })
                .Where(x => x != null).ToList();

            return result;
        }

        private Product CreateProduct(string[] column, string[] headers)
        {
            var id = column[Array.IndexOf(headers, "id")].Trim('"').Trim();
            if (string.IsNullOrEmpty(id)) throw new Exception("id is empty");

            var name = column[Array.IndexOf(headers, "name")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("product Name is empty");

            var price = column[Array.IndexOf(headers, "price")].Trim('"').Trim();
            if (decimal.TryParse(price, out var prices)) throw new Exception("product price is not decimal");

            var overallRating = column[Array.IndexOf(headers, "overallrating")].Trim('"').Trim();
            if (decimal.TryParse(overallRating, out var overallRatings))
                throw new Exception("product OverallRating is not number");

            var totalFavorite = column[Array.IndexOf(headers, "totalfavorites")].Trim('"').Trim();
            if (int.TryParse(totalFavorite, out var totalFavorites))
                throw new Exception("product TotalFavorites is not number");

            var totalReview = column[Array.IndexOf(headers, "totalreviews")].Trim('"').Trim();
            if (int.TryParse(totalReview, out var totalReviews))
                throw new Exception("product TotalReviews is not number");

            var availableStock = column[Array.IndexOf(headers, "availablestock")].Trim('"').Trim();
            if (int.TryParse(availableStock, out var availableStocks))
                throw new Exception("product AvailableStock is not number");

            var manufacturerId = column[Array.IndexOf(headers, "manufacturerid")].Trim('"').Trim();
            if (int.TryParse(manufacturerId, out var manufacturerIds))
                throw new Exception("product ManufacturerId is not number");

            var categoryId = column[Array.IndexOf(headers, "categoryid")].Trim('"').Trim();
            if (int.TryParse(categoryId, out var categoryIds)) throw new Exception("product CategoryId is not number");

            var lastUpdated = column[Array.IndexOf(headers, "lastupdated")].Trim('"').Trim();
            var lastUpdatedBy = column[Array.IndexOf(headers, "LastUpdatedBy")].Trim('"').Trim();

            var description = column[Array.IndexOf(headers, "description")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("catalog Brand Description is empty");

            return new Product
            {
                Name = name,
                Id = id,
                Description = description,
                AvailableStock = availableStocks,
                CategoryId = categoryIds,
                Price = prices,
                OverallRating = overallRatings,
                TotalFavorites = totalFavorites,
                TotalReviews = totalReviews,
                LastUpdated = DateTime.Parse(lastUpdated),
                LastUpdatedBy = lastUpdatedBy,
                ManufacturerId = manufacturerIds
            };
        }

        private IEnumerable<Product> GetPreconfiguredProduct()
        {
            return new List<Product>();
        }

        #endregion

        #region ProductColor

        private IEnumerable<ProductColor> GetProductColorFromFile(string contentRootPath,
            ILogger<CatalogContextSeed> logger)
        {
            var csvFileProductColors = Path.Combine(contentRootPath, "Setup", "ProductColor.csv");

            if (!File.Exists(csvFileProductColors)) return GetPreconfiguredProductColor();

            string[] csvheaders;
            try
            {
                string[] requiredHeaders = { "productid", "name" };
                csvheaders = GetHeaders(csvFileProductColors, requiredHeaders);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return GetPreconfiguredProductColor();
            }

            return File.ReadAllLines(csvFileProductColors)
                .Skip(1) // skip header row
                .Select(row => Regex.Split(row, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"))
                .SelectTry(x => CreateProductColor(x, csvheaders))
                .OnCaughtException(ex =>
                {
                    logger.LogError(ex.Message);
                    return null;
                })
                .Where(x => x != null);
        }

        private ProductColor CreateProductColor(string[] column, string[] headers)
        {
            var productId = column[Array.IndexOf(headers, "productid")].Trim('"').Trim();
            if (string.IsNullOrEmpty(productId)) throw new Exception("ProductId is empty");

            var name = column[Array.IndexOf(headers, "name")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("Name is empty");

            return new ProductColor
            {
                Name = name,
                ProductId = productId,
            };
        }

        private IEnumerable<ProductColor> GetPreconfiguredProductColor()
        {
            return new List<ProductColor>();
        }

        #endregion

        #region ProductImage

        private IEnumerable<ProductImage> GetProductImageFromFile(string contentRootPath,
            ILogger<CatalogContextSeed> logger)
        {
            var csvFileProductImages = Path.Combine(contentRootPath, "Setup", "ProductImage.csv");

            if (!File.Exists(csvFileProductImages)) return GetPreconfiguredProductImage();

            string[] csvheaders;
            try
            {
                string[] requiredHeaders = { "productid", "imageid" };
                csvheaders = GetHeaders(csvFileProductImages, requiredHeaders);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return GetPreconfiguredProductImage();
            }

            return File.ReadAllLines(csvFileProductImages)
                .Skip(1) // skip header row
                .Select(row => Regex.Split(row, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"))
                .SelectTry(x =>
                {
                    PlacePictureById(x, csvheaders, "ProductImage");
                    return CreateProductImage(x, csvheaders);
                })
                .OnCaughtException(ex =>
                {
                    logger.LogError(ex.Message);
                    return null;
                })
                .Where(x => x != null);
        }

        private ProductImage CreateProductImage(string[] column, string[] headers)
        {
            var productId = column[Array.IndexOf(headers, "productid")].Trim('"').Trim();
            if (string.IsNullOrEmpty(productId)) throw new Exception("Product id is empty");

            var imageName = column[Array.IndexOf(headers, "imageid")].Trim('"').Trim();
            if (string.IsNullOrEmpty(imageName)) throw new Exception("catalog Brand image name is empty");

            return new ProductImage
            {
                ProductId = productId,
                ImageName = imageName
            };
        }

        private IEnumerable<ProductImage> GetPreconfiguredProductImage()
        {
            return new List<ProductImage>();
        }

        #endregion

        #region ProductRating

        private IEnumerable<ProductRating> GetProductRatingFromFile(string contentRootPath,
            ILogger<CatalogContextSeed> logger)
        {
            var csvFileProductRatings = Path.Combine(contentRootPath, "Setup", "ProductRating.csv");

            if (!File.Exists(csvFileProductRatings)) return GetPreconfiguredProductRating();

            string[] csvheaders;
            try
            {
                string[] requiredHeaders = { "productid", "userid", "rate" };
                csvheaders = GetHeaders(csvFileProductRatings, requiredHeaders);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return GetPreconfiguredProductRating();
            }

            return File.ReadAllLines(csvFileProductRatings)
                .Skip(1) // skip header row
                .Select(row => Regex.Split(row, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"))
                .SelectTry(x => CreateProductRating(x, csvheaders))
                .OnCaughtException(ex =>
                {
                    logger.LogError(ex.Message);
                    return null;
                })
                .Where(x => x != null);
        }

        private ProductRating CreateProductRating(string[] column, string[] headers)
        {
            var productId = column[Array.IndexOf(headers, "productid")].Trim('"').Trim();
            if (string.IsNullOrEmpty(productId)) throw new Exception("Product Id is empty");

            var userId = column[Array.IndexOf(headers, "userid")].Trim('"').Trim();
            if (string.IsNullOrEmpty(userId)) throw new Exception("User id is empty");

            var rate = column[Array.IndexOf(headers, "rate")].Trim('"').Trim();
            if (!decimal.TryParse(rate, out var rates)) throw new Exception("rates name is empty");

            return new ProductRating
            {
                ProductId = productId,
                UserId = userId,
                Rate = rates
            };
        }

        private IEnumerable<ProductRating> GetPreconfiguredProductRating()
        {
            return new List<ProductRating>();
        }

        #endregion



        #region Utility

        private string[] GetHeaders(string csvfile, string[] requiredHeaders, string[] optionalHeaders = null)
        {
            var csvheaders = File.ReadLines(csvfile).First().ToLowerInvariant().Split(',');

            if (csvheaders.Count() < requiredHeaders.Count())
                throw new Exception(
                    $"requiredHeader count '{requiredHeaders.Count()}' is bigger then csv header count '{csvheaders.Count()}' ");

            if (optionalHeaders != null)
                if (csvheaders.Count() > requiredHeaders.Count() + optionalHeaders.Count())
                    throw new Exception(
                        $"csv header count '{csvheaders.Count()}'  is larger then required '{requiredHeaders.Count()}' and optional '{optionalHeaders.Count()}' headers count");

            foreach (var requiredHeader in requiredHeaders)
                if (!csvheaders.Contains(requiredHeader))
                    throw new Exception($"does not contain required header '{requiredHeader}'");

            return csvheaders;
        }

        private void GetPictures(string contentRootPath, string picturePath, string zipName)
        {
            var directory = new DirectoryInfo(picturePath);
            if (!directory.Exists)
            {
                directory.Create();
            }

            foreach (var file in directory.GetFiles()) file.Delete();

            var zipFileCatalogItemPictures = Path.Combine(contentRootPath, "Setup", zipName);
            ZipFile.ExtractToDirectory(zipFileCatalogItemPictures, picturePath);
        }

        private void PlacePictureById(string[] column, string[] headers, string picturePath)
        {
            var directory = new DirectoryInfo(picturePath);

            var id = column[Array.IndexOf(headers, "id")].Trim('"').Trim();
            var dir = directory.GetDirectories().SingleOrDefault(x => x?.Name == id.ToString());
            if (dir != null && dir.Exists)
            {
                foreach (var fileInfo in dir.GetFiles()) fileInfo.Delete();

                dir.Delete();
            }

            var files = directory.GetFiles();
            directory.CreateSubdirectory(id);

            var imageName = column[Array.IndexOf(headers, "imagename")].Trim('"').Trim();

            var file = files.SingleOrDefault(x => x.Name == imageName);
            var subdir = directory.GetDirectories(id).FirstOrDefault();
            var fileToInsert = subdir?.GetFiles(imageName).FirstOrDefault();
            if (fileToInsert != null && fileToInsert.Exists)
            {
                fileToInsert.Delete();
            }
            file?.CopyTo(picturePath + "/" + id);
            file?.Delete();
        }

        #endregion
    }
}