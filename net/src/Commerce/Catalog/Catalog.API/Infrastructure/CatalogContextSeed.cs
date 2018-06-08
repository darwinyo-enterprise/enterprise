using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Catalog.API.Extensions;
using Catalog.API.Models;
using Microsoft.AspNetCore.Hosting;
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
                    const string manufacturer = "Manufacturer";
                    await context.SpResetIdentity(manufacturer);
                    GetPictures(contentRootPath, _env.WebRootPath + "/" + manufacturer, manufacturer + ".zip");

                    if (useCustomizationData)
                    {
                        var manufacturers = GetManufacturerFromFile(contentRootPath, logger);
                        foreach (var manufacturer1 in manufacturers)
                        {
                            await context.Manufacturers.AddAsync(manufacturer1);
                            await context.SaveChangesAsync();
                        }
                    }
                    else
                    {
                        await context.Manufacturers.AddRangeAsync(GetPreconfiguredManufacturer());

                        await context.SaveChangesAsync();
                    }

                    DeleteAllFilesWithinDir(_env.WebRootPath + "/" + manufacturer);
                    ValidateFileDirExists(manufacturer);
                }

                if (!context.Categories.Any())
                {
                    const string category = "Category";
                    await context.SpResetIdentity(category);
                    GetPictures(contentRootPath, _env.WebRootPath + "/" + category, category + ".zip");

                    if (useCustomizationData)
                    {
                        var categories = GetCategoryFromFile(contentRootPath, logger);
                        foreach (var category1 in categories)
                        {
                            await context.Categories.AddAsync(category1);
                            await context.SaveChangesAsync();
                        }
                    }
                    else
                    {
                        await context.Categories.AddRangeAsync(GetPreconfiguredCategory());

                        await context.SaveChangesAsync();
                    }

                    DeleteAllFilesWithinDir(_env.WebRootPath + "/" + category);
                    ValidateFileDirExists(category);
                }

                if (!context.Users.Any())
                {
                    if (useCustomizationData)
                    {
                        var users = GetUserFromFile(contentRootPath, logger);
                        foreach (var user1 in users)
                        {
                            await context.Users.AddAsync(user1);
                            await context.SaveChangesAsync();
                        }
                    }
                    else
                    {
                        await context.Users.AddRangeAsync(GetPreconfiguredUser());

                        await context.SaveChangesAsync();
                    }
                }

                if (!context.Products.Any())
                {
                    if (useCustomizationData)
                    {
                        var products = GetProductFromFile(contentRootPath, logger);
                        foreach (var product1 in products)
                        {
                            await context.Products.AddAsync(product1);
                            await context.SaveChangesAsync();
                        }
                    }
                    else
                    {
                        await context.Products.AddRangeAsync(GetPreconfiguredProduct());

                        await context.SaveChangesAsync();
                    }
                }

                if (!context.ProductColors.Any())
                {
                    await context.SpResetIdentity("ProductColor");
                    if (useCustomizationData)
                    {
                        var productcolors = GetProductColorFromFile(contentRootPath, logger);
                        foreach (var productcolor1 in productcolors)
                        {
                            await context.ProductColors.AddAsync(productcolor1);
                            await context.SaveChangesAsync();
                        }
                    }
                    else
                    {
                        await context.ProductColors.AddRangeAsync(GetPreconfiguredProductColor());

                        await context.SaveChangesAsync();
                    }
                }

                if (!context.ProductRatings.Any())
                {
                    await context.SpResetIdentity("ProductRating");
                    if (useCustomizationData)
                    {
                        var productratings = GetProductRatingFromFile(contentRootPath, logger);
                        foreach (var productrating1 in productratings)
                        {
                            await context.ProductRatings.AddAsync(productrating1);
                            await context.SaveChangesAsync();
                        }
                    }
                    else
                    {
                        await context.ProductRatings.AddRangeAsync(GetPreconfiguredProductRating());

                        await context.SaveChangesAsync();
                    }
                }

                if (!context.ProductImages.Any())
                {
                    const string productImage = "ProductImage";
                    await context.SpResetIdentity(productImage);
                    GetPictures(contentRootPath, _env.WebRootPath + "/" + productImage, productImage + ".zip");

                    if (useCustomizationData)
                    {
                        var productimages = GetProductImageFromFile(contentRootPath, logger);
                        foreach (var productimage1 in productimages)
                        {
                            await context.ProductImages.AddAsync(productimage1);
                            await context.SaveChangesAsync();
                        }
                    }
                    else
                    {
                        await context.ProductImages.AddRangeAsync(GetPreconfiguredProductImage());

                        await context.SaveChangesAsync();
                    }

                    DeleteAllFilesWithinDir(_env.WebRootPath + "/" + productImage);
                    ValidateFileDirExists(productImage);
                }
            });
        }

        private void ValidateFileDirExists(string filename)
        {
            var dirRoot = new DirectoryInfo(_env.WebRootPath + "/" + filename);
            var dirs = dirRoot.GetDirectories();
            foreach (var directoryInfo in dirs)
            {
                if (directoryInfo.GetFiles().Length > 0) continue;

                throw new Exception("File Directory Seed is Empty");
            }
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
            //var id = column[Array.IndexOf(headers, "id")].Trim('"').Trim();
            //if (!int.TryParse(id, out var ids)) throw new Exception($"category id is empty");

            var name = column[Array.IndexOf(headers, "name")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("Manufacturer Name is empty");

            var description = column[Array.IndexOf(headers, "description")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("Manufacturer Description is empty");

            var imageName = column[Array.IndexOf(headers, "imagename")].Trim('"').Trim();
            if (string.IsNullOrEmpty(imageName)) throw new Exception("Manufacturer image name is empty");

            return new Manufacturer
            {
                //Id = ids,
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
                new Manufacturer {Name = "Asus", Description = "None", ImageName = "Asus.png"},
                new Manufacturer {Name = "Apple", Description = "None", ImageName = "Apple.png"},
                new Manufacturer {Name = "Google", Description = "None", ImageName = "Google.png"},
                new Manufacturer {Name = "Docker", Description = "None", ImageName = "Docker.png"},
                new Manufacturer {Name = "Sony", Description = "None", ImageName = "Sony.png"}
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
                string[] requiredHeaders = { "name", "description", "imagename" };
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
                    PlacePictureById(x, csvheaders, _env.WebRootPath + "/Category");
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
            //var id = column[Array.IndexOf(headers, "id")].Trim('"').Trim();
            //if (!int.TryParse(id, out var ids)) throw new Exception($"category id is empty");

            var name = column[Array.IndexOf(headers, "name")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("category Name is empty");

            var description = column[Array.IndexOf(headers, "description")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("category Description is empty");

            var imageName = column[Array.IndexOf(headers, "imagename")].Trim('"').Trim();
            if (string.IsNullOrEmpty(imageName)) throw new Exception("category image name is empty");

            return new Category
            {
                //Id = ids,
                Name = name,
                Description = description,
                ImageName = imageName
            };
        }

        private IEnumerable<Category> GetPreconfiguredCategory()
        {
            return new List<Category>
            {
                new Category {Name = "Phone", Description = "None", ImageName = "Phone.png"},
                new Category {Name = "Software", Description = "None", ImageName = "Software.png"},
                new Category {Name = "Laptop", Description = "None", ImageName = "Laptop.png"},
                new Category {Name = "Console", Description = "None", ImageName = "Console.png"},
                new Category {Name = "Tablet", Description = "None", ImageName = "Tablet.png"}
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
                    "lastupdated", "lastupdatedby", "availablestock", "manufacturerid", "categoryid","location",
                    "minpurchase","sold","hasexpiry","expiredate","discount","totalwishlist"
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
            if (!decimal.TryParse(price, out var prices)) throw new Exception("product price is not decimal");

            var overallRating = column[Array.IndexOf(headers, "overallrating")].Trim('"').Trim();
            if (!decimal.TryParse(overallRating, out var overallRatings))
                throw new Exception("product OverallRating is not number");

            var totalFavorite = column[Array.IndexOf(headers, "totalfavorites")].Trim('"').Trim();
            if (!int.TryParse(totalFavorite, out var totalFavorites))
                throw new Exception("product TotalFavorites is not number");

            var totalReview = column[Array.IndexOf(headers, "totalreviews")].Trim('"').Trim();
            if (!int.TryParse(totalReview, out var totalReviews))
                throw new Exception("product TotalReviews is not number");

            var availableStock = column[Array.IndexOf(headers, "availablestock")].Trim('"').Trim();
            if (!int.TryParse(availableStock, out var availableStocks))
                throw new Exception("product AvailableStock is not number");

            var manufacturerId = column[Array.IndexOf(headers, "manufacturerid")].Trim('"').Trim();
            if (!int.TryParse(manufacturerId, out var manufacturerIds))
                throw new Exception("product ManufacturerId is not number");

            var categoryId = column[Array.IndexOf(headers, "categoryid")].Trim('"').Trim();
            if (!int.TryParse(categoryId, out var categoryIds)) throw new Exception("product CategoryId is not number");

            var lastUpdated = column[Array.IndexOf(headers, "lastupdated")].Trim('"').Trim();
            if (!DateTime.TryParseExact(lastUpdated, "dd-MM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None,
                out var lastUpdates)) throw new Exception("lastUpdated is not Datetime");

            var lastUpdatedBy = column[Array.IndexOf(headers, "lastupdatedby")].Trim('"').Trim();
            var description = column[Array.IndexOf(headers, "description")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("catalog Brand Description is empty");

            var location = column[Array.IndexOf(headers, "location")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("catalog location is empty");

            var minpurchase = column[Array.IndexOf(headers, "minpurchase")].Trim('"').Trim();
            if (!int.TryParse(minpurchase, out var minpurchaseResult)) throw new Exception("catalog minpurchase is not number");

            var sold = column[Array.IndexOf(headers, "sold")].Trim('"').Trim();
            if (!int.TryParse(sold, out var solds)) throw new Exception("catalog sold is not number");

            var hasExpiry = column[Array.IndexOf(headers, "hasexpiry")].Trim('"').Trim();
            int.TryParse(hasExpiry, out var hasExpiryResult);
            bool hasExpirys;
            if (hasExpiryResult > 1 && hasExpiryResult < 0) throw new Exception("catalog has Expiry is not bool");
            hasExpirys = hasExpiryResult == 1;

            var expireDate = column[Array.IndexOf(headers, "expiredate")].Trim('"').Trim();
            var result = DateTime.TryParseExact(expireDate, "dd-MM-yyyy", CultureInfo.InvariantCulture,
                DateTimeStyles.None, out var expireDates);
            if (!result) throw new Exception("expiry date is not Datetime");

            var discount = column[Array.IndexOf(headers, "discount")].Trim('"').Trim();
            if (!int.TryParse(discount, out var discounts)) throw new Exception("catalog discount is not number");

            var totalWishlist = column[Array.IndexOf(headers, "totalwishlist")].Trim('"').Trim();
            if (!int.TryParse(totalWishlist, out var totalWishlists)) throw new Exception("catalog totalwishlist is not number");

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
                LastUpdated = lastUpdates,
                LastUpdatedBy = lastUpdatedBy,
                ManufacturerId = manufacturerIds,
                Location = location,
                MinPurchase = minpurchaseResult,
                TotalSold = solds,
                HasExpiry = hasExpirys,
                ExpireDate = expireDates,
                Discount = discounts,
                TotalWishlist = totalWishlists
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
            //var id = column[Array.IndexOf(headers, "id")].Trim('"').Trim();
            //if (!int.TryParse(id, out var ids)) throw new Exception($"id is empty");

            var productId = column[Array.IndexOf(headers, "productid")].Trim('"').Trim();
            if (string.IsNullOrEmpty(productId)) throw new Exception("ProductId is empty");

            var name = column[Array.IndexOf(headers, "name")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("Name is empty");

            return new ProductColor
            {
                //Id = ids,
                Name = name,
                ProductId = productId
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
                string[] requiredHeaders = { "productid", "imagename" };
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
                    PlacePictureById(x, csvheaders, _env.WebRootPath + "/ProductImage");
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
            //var id = column[Array.IndexOf(headers, "id")].Trim('"').Trim();
            //if (!int.TryParse(id, out var ids)) throw new Exception($"id is empty");

            var productId = column[Array.IndexOf(headers, "productid")].Trim('"').Trim();
            if (string.IsNullOrEmpty(productId)) throw new Exception("Product id is empty");

            var imageName = column[Array.IndexOf(headers, "imagename")].Trim('"').Trim();
            if (string.IsNullOrEmpty(imageName)) throw new Exception("catalog Brand image name is empty");

            return new ProductImage
            {
                //Id = ids,
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
            //var id = column[Array.IndexOf(headers, "id")].Trim('"').Trim();
            //if (!int.TryParse(id, out var ids)) throw new Exception($"id is empty");

            var productId = column[Array.IndexOf(headers, "productid")].Trim('"').Trim();
            if (string.IsNullOrEmpty(productId)) throw new Exception("Product Id is empty");

            var userId = column[Array.IndexOf(headers, "userid")].Trim('"').Trim();
            if (string.IsNullOrEmpty(userId)) throw new Exception("User id is empty");

            var rate = column[Array.IndexOf(headers, "rate")].Trim('"').Trim();
            if (!decimal.TryParse(rate, out var rates)) throw new Exception("rates name is empty");

            return new ProductRating
            {
                //Id = ids,
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
            if (!directory.Exists) directory.Create();

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
            if (fileToInsert != null && fileToInsert.Exists) fileToInsert.Delete();

            File.Copy(picturePath + "/" + file.Name, picturePath + "/" + id + "/" + file.Name, true);
        }

        private void DeleteAllFilesWithinDir(string directoryPath)
        {
            var directory = new DirectoryInfo(directoryPath);
            var files = directory.GetFiles();
            foreach (var fileInfo in files) fileInfo.Delete();
        }

        #endregion
    }
}