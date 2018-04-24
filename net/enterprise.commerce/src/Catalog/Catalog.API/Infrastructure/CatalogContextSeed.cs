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
        public async Task SeedAsync(CatalogContext context, IHostingEnvironment env, IOptions<CatalogSettings> settings,
            ILogger<CatalogContextSeed> logger)
        {
            var policy = CreatePolicy(logger, nameof(CatalogContextSeed));

            await policy.ExecuteAsync(async () =>
            {
                var useCustomizationData = settings.Value.UseCustomizationData;
                var contentRootPath = env.ContentRootPath;

                if (!context.Manufacturers.Any())
                {
                    GetPictures(contentRootPath, "Manufacturer", "Manufacturer.zip");

                    await context.Manufacturers.AddRangeAsync(useCustomizationData
                        ? GetManufacturerFromFile(contentRootPath, logger)
                        : GetPreconfiguredManufacturer());

                    await context.SaveChangesAsync();

                    await context.Manufacturers.ToListAsync();
                }

                if (!context.Categories.Any())
                {
                    GetPictures(contentRootPath, "Category", "Category.zip");

                    await context.Categories.AddRangeAsync(useCustomizationData
                        ? GetCategoryFromFile(contentRootPath, logger)
                        : GetPreconfiguredCategory());

                    await context.SaveChangesAsync();

                    await context.Categories.ToListAsync();
                }
            });
        }

        private IEnumerable<Manufacturer> GetManufacturerFromFile(string contentRootPath,
            ILogger<CatalogContextSeed> logger)
        {
            var csvFileManufacturers = Path.Combine(contentRootPath, "Setup", "Manufacturer.csv");

            if (!File.Exists(csvFileManufacturers)) return GetPreconfiguredManufacturer();

            string[] csvheaders;
            try
            {
                string[] requiredHeaders = {"Id", "Name", "Description", "ImageName"};
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
                    PlacePictureById(x, csvheaders, "Manufacturer");
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
            var id = column[Array.IndexOf(headers, "Id")].Trim('"').Trim();
            if (!int.TryParse(id, out var ids)) throw new Exception($"id={id}is not a valid number");

            var name = column[Array.IndexOf(headers, "Name")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("catalog Brand Name is empty");

            var description = column[Array.IndexOf(headers, "Description")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("catalog Brand Description is empty");

            var imageName = column[Array.IndexOf(headers, "ImageName")].Trim('"').Trim();
            if (string.IsNullOrEmpty(imageName)) throw new Exception("catalog Brand image name is empty");

            return new Manufacturer
            {
                Name = name,
                Id = ids,
                Description = description,
                ImageName = imageName
            };
        }

        private IEnumerable<Manufacturer> GetPreconfiguredManufacturer()
        {
            return new List<Manufacturer>
            {
                new Manufacturer {Name = "Microsoft", Description = "None", Id = 1, ImageName = "Microsoft.png"},
                new Manufacturer {Name = "Docker", Description = "None", Id = 2, ImageName = "Docker.png"},
                new Manufacturer {Name = "Google", Description = "None", Id = 3, ImageName = "Google.png"},
                new Manufacturer {Name = "Asus", Description = "None", Id = 4, ImageName = "Asus.png"},
                new Manufacturer {Name = "Apple", Description = "None", Id = 5, ImageName = "Apple.png"}
            };
        }

        private IEnumerable<Category> GetCategoryFromFile(string contentRootPath,
            ILogger<CatalogContextSeed> logger)
        {
            var csvFileCategorys = Path.Combine(contentRootPath, "Setup", "Category.csv");

            if (!File.Exists(csvFileCategorys)) return GetPreconfiguredCategory();

            string[] csvheaders;
            try
            {
                string[] requiredHeaders = {"Id", "Name", "Description", "ImageName"};
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
            var id = column[Array.IndexOf(headers, "Id")].Trim('"').Trim();
            if (!int.TryParse(id, out var ids)) throw new Exception($"id={id}is not a valid number");

            var name = column[Array.IndexOf(headers, "Name")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("catalog Brand Name is empty");

            var description = column[Array.IndexOf(headers, "Description")].Trim('"').Trim();
            if (string.IsNullOrEmpty(name)) throw new Exception("catalog Brand Description is empty");

            var imageName = column[Array.IndexOf(headers, "ImageName")].Trim('"').Trim();
            if (string.IsNullOrEmpty(imageName)) throw new Exception("catalog Brand image name is empty");

            return new Category
            {
                Name = name,
                Id = ids,
                Description = description,
                ImageName = imageName
            };
        }

        private IEnumerable<Category> GetPreconfiguredCategory()
        {
            return new List<Category>
            {
                new Category {Name = "Phone", Description = "None", Id = 1, ImageName = "Phone.png"},
                new Category {Name = "Software", Description = "None", Id = 2, ImageName = "Software.png"},
                new Category {Name = "Laptop", Description = "None", Id = 3, ImageName = "Laptop.png"},
                new Category {Name = "Console", Description = "None", Id = 4, ImageName = "Console.png"},
                new Category {Name = "Tablet", Description = "None", Id = 5, ImageName = "Tablet.png"}
            };
        }

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
            foreach (var file in directory.GetFiles()) file.Delete();

            var zipFileCatalogItemPictures = Path.Combine(contentRootPath, "Setup", zipName);
            ZipFile.ExtractToDirectory(zipFileCatalogItemPictures, picturePath);
        }

        private void PlacePictureById(string[] column, string[] headers, string picturePath)
        {
            var directory = new DirectoryInfo(picturePath);

            var id = column[Array.IndexOf(headers, "Id")].Trim('"').Trim();
            var dir = directory.GetDirectories().SingleOrDefault(x => x?.Name == id.ToString());
            if (dir != null && dir.Exists)
            {
                foreach (var fileInfo in dir.GetFiles()) fileInfo.Delete();

                dir.Delete();
            }

            var files = directory.GetFiles();
            directory.CreateSubdirectory(id);

            var imageName = column[Array.IndexOf(headers, "ImageName")].Trim('"').Trim();

            var file = files.SingleOrDefault(x => x.Name == imageName);
            file?.MoveTo(id);
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
    }
}