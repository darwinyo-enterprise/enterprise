using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Catalog.API.Helpers;
using Catalog.API.Infrastructure;
using Catalog.API.Models;
using Catalog.API.ViewModels;
using Enterprise.Library.FileUtility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Catalog.API.Controllers
{
    [Produces("application/json")]
    [Route("api/v1/[controller]")]
    public class ProductController : Controller
    {
        private readonly CatalogContext _catalogContext;
        private readonly IFileUtility _fileUtility;
        private readonly CatalogSettings _settings;

        public ProductController(CatalogContext catalogContext,
            IFileUtility fileUtility, IOptionsSnapshot<CatalogSettings> settings)
        {
            _catalogContext = catalogContext ??
                              throw new ArgumentNullException(nameof(catalogContext));
            _fileUtility = fileUtility;
            _settings = settings.Value;
        }

        #region Rating, Inventory, etc

        /// <summary>
        ///     store file upload to directory specified.
        ///     this only used for updating Product.
        /// </summary>
        /// <returns>
        ///     json response
        /// </returns>
        // PUT api/v1/Product/inventory[?id=3&amount=10]
        [HttpPut("inventory")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> UpdateInventoryAsync(string id, int amount,
            CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrEmpty(id) || amount <= 0) return BadRequest();

                // select db
                var product = await _catalogContext.Products.SingleOrDefaultAsync(x =>
                    x.Id == id, cancellationToken);

                if (product != null)
                {
                    product.AddStock(amount);
                    await _catalogContext.SaveChangesAsync(cancellationToken);

                    return CreatedAtAction(nameof(UpdateInventoryAsync), product.Name + " Inventory Updated.");
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }

        /// <summary>
        ///     store file upload to directory specified.
        ///     this only used for updating Product.
        /// </summary>
        /// <returns>
        ///     json response
        /// </returns>
        // POST api/v1/Product/rate
        [HttpPost("rate")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> RateProductAsync([FromBody] ProductRateViewModel productRateViewModel,
            CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrEmpty(productRateViewModel.ProductId) || productRateViewModel.Rate <= 0)
                    return BadRequest();

                // select db
                var product = await _catalogContext.Products.SingleOrDefaultAsync(x =>
                    x.Id != productRateViewModel.ProductId, cancellationToken);

                if (product != null)
                {
                    var rates = new ProductRating
                    {
                        ProductId = productRateViewModel.ProductId,
                        Rate = productRateViewModel.Rate,
                        User = productRateViewModel.User
                    };

                    product.UpdateRate(product.ProductRatings.Count, productRateViewModel.Rate);
                    await _catalogContext.ProductRatings.AddAsync(rates, cancellationToken);
                    _catalogContext.Products.Update(product);

                    await _catalogContext.SaveChangesAsync(cancellationToken);

                    return CreatedAtAction(nameof(RateProductAsync), product.Name + " Rated.");
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                return Json("Rate Product Failed: " + ex.Message);
            }
        }

        #endregion

        #region Queries

        /// <summary>
        ///     Fetch All Paginated Products By Page size and page index
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="cancellationToken"></param>
        /// <param name="pageSize"></param>
        /// <returns>list of Products</returns>
        // GET api/v1/Product[?pageSize=3&pageIndex=10]
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCatalogViewModel<CatalogItemViewModel>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPaginatedCatalogAsync(CancellationToken cancellationToken,
            [FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 0)
        {
            var totalItems = await _catalogContext.Products
                .LongCountAsync(cancellationToken);

            var list = await _catalogContext.Products
                .Include(x => x.ProductImages)
                .OrderBy(c => c.Name)
                .Skip(pageSize * pageIndex)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            var model = CreatePaginatedCatalogViewModel(pageSize, pageIndex, totalItems, list);

            return Ok(model);
        }

        /// <summary>
        ///     Fetch All Paginated Products By Page size and page index with name
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <param name="name"></param>
        /// <param name="pageSize"></param>
        /// <param name="pageIndex"></param>
        /// <returns>list of Products</returns>
        // GET api/v1/Product/query/Mac[?pageSize=3&pageIndex=10]
        [HttpGet("query/{name:minlength(1)}")]
        [ProducesResponseType(typeof(PaginatedCatalogViewModel<CatalogItemViewModel>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPaginatedCatalogByNameAsync(CancellationToken cancellationToken, string name,
            [FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 0)
        {
            var totalItems = await _catalogContext.Products
                .Where(x => x.Name.StartsWith(name))
                .LongCountAsync(cancellationToken);

            var list = await _catalogContext.Products
                .OrderBy(c => c.Name)
                .Skip(pageSize * pageIndex)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            var model = CreatePaginatedCatalogViewModel(pageSize, pageIndex, totalItems, list);

            return Ok(model);
        }

        /// <summary>
        ///     Fetch All Paginated Products By Page size and page index filter by category or Manufacturer,can be both
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <param name="idManufacturer"></param>
        /// <param name="pageSize"></param>
        /// <param name="pageIndex"></param>
        /// <param name="idCategory"></param>
        /// <returns>list of Products</returns>
        // GET api/v1/Product/query/catagory/null/manufacturer/3[?pageSize=3&pageIndex=10]
        [HttpGet("query/category/{idCategory}/manufacturer/{idManufacturer}")]
        [ProducesResponseType(typeof(PaginatedCatalogViewModel<CatalogItemViewModel>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPaginatedCatalogByCategoryOrManufacturerAsync(
            CancellationToken cancellationToken, int? idCategory, int? idManufacturer, [FromQuery] int pageSize = 10,
            [FromQuery] int pageIndex = 0)
        {
            var root = (IQueryable<Product>)_catalogContext.Products;

            if (idCategory.HasValue) root = root.Where(ci => ci.CategoryId == idCategory);

            if (idManufacturer.HasValue) root = root.Where(ci => ci.ManufacturerId == idManufacturer);

            var totalItems = await root
                .LongCountAsync(cancellationToken);

            var list = await root
                .OrderBy(c => c.Name)
                .Skip(pageSize * pageIndex)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
            var model = CreatePaginatedCatalogViewModel(pageSize, pageIndex, totalItems, list);

            return Ok(model);
        }

        private PaginatedCatalogViewModel<CatalogItemViewModel> CreatePaginatedCatalogViewModel(int pageSize,
            int pageIndex, long totalItems, List<Product> list)
        {
            var page = new List<CatalogItemViewModel>();
            list.ForEach(x =>
            {
                var id = x.ProductImages.FirstOrDefault()?.Id;
                if (id != null)
                    page.Add(new CatalogItemViewModel
                    {
                        CategoryId = x.CategoryId,
                        CatalogId = x.Id,
                        Id = id.Value,
                        ImageName = x.ProductImages.FirstOrDefault()?.ImageName,
                        ManufacturerId = x.ManufacturerId,
                        Name = x.Name,
                        OverallRating = x.OverallRating,
                        Price = x.Price,
                        TotalFavorites = x.TotalFavorites,
                        TotalReviews = x.TotalReviews
                    });
            });


            var itemsOnPage = UrlImageHelper<CatalogItemViewModel>.ChangeUriPlaceholder(page,
                _settings.ProductImageBaseUrl, _settings.AzureStorageEnabled);

            var model = new PaginatedCatalogViewModel<CatalogItemViewModel>(
                pageIndex, pageSize, totalItems, itemsOnPage);
            return model;
        }

        private PaginatedListViewModel<ItemViewModel> CreatePaginatedListViewModel(int pageSize,
            int pageIndex, long totalItems, List<Product> list)
        {
            var page = new List<ItemViewModel>();
            list.ForEach(x =>
            {
                page.Add(new ItemViewModel
                {
                    Id = x.Id,
                    Name = x.Name
                });
            });

            var model = new PaginatedListViewModel<ItemViewModel>(
                pageIndex, pageSize, totalItems, page);
            return model;
        }

        #endregion

        #region Product

        /// <summary>
        ///     Fetch Single Product by Product id
        ///     used for Admin
        ///     TODO: Implement Authorization
        /// </summary>
        /// <param name="id">Product id</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Product</returns>
        // GET api/v1/Product/5
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ProductViewModel), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetProductByIdAsync(string id, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(id)) return BadRequest(new { Message = "Id Cant be null" });

            var result = await _catalogContext.Products.Where(x => x.Id == id)
                .Include(x => x.ProductImages)
                .Include(x => x.ProductColors)
                .FirstOrDefaultAsync(cancellationToken);

            if (result != null)
            {
                var imagesWithUrl = new List<ProductImage>();
                foreach (var img in result.ProductImages.ToList())
                {
                    var imgWithUrl = await UrlImageHelper<ProductImage>.GetImageBase64UrlAsync(img, _fileUtility, "ProductImage",
                        cancellationToken);
                    imagesWithUrl.Add(imgWithUrl);
                }

                var productViewModel = new ProductViewModel
                {
                    CategoryId = result.CategoryId,
                    ManufacturerId = result.ManufacturerId,
                    Description = result.Description,
                    Id = result.Id,
                    Name = result.Name,
                    Price = result.Price,
                    ProductColors = result.ProductColors.ToArray(),
                    ProductImages = imagesWithUrl.ToArray()
                };
                return Ok(productViewModel);
            }

            return NotFound();
        }

        /// <summary>
        ///     Fetch Single Product by Product id
        ///     used for display product info anonymously
        ///     TODO: Change Implementation this not ready yet
        /// </summary>
        /// <param name="id">Product id</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Product</returns>
        // GET api/v1/Product/5
        [HttpGet("info/{id}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ProductViewModel), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetProductInfoByIdAsync(string id, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(id)) return BadRequest(new { Message = "Id Cant be null" });

            var result = await _catalogContext.Products.Where(x => x.Id == id)
                .FirstOrDefaultAsync(cancellationToken);

            if (result != null) return Ok(result);

            return NotFound();
        }

        /// <summary>
        ///     Fetch All Products Used for Admin Management.
        ///     TODO: Implement Authorization
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <param name="pageSize"></param>
        /// <param name="pageIndex"></param>
        /// <returns>Product</returns>
        // GET api/v1/Product/list
        [HttpGet("list")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(PaginatedListViewModel<ItemViewModel>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetListProductsAsync(CancellationToken cancellationToken, [FromQuery] int pageSize = 10,
            [FromQuery] int pageIndex = 0)
        {
            if (pageIndex < 0 || pageSize <= 0)
            {
                return BadRequest(new { Message = $"Invalid pagination request." });
            }
            var root = (IQueryable<Product>)_catalogContext.Products;

            var totalItems = await root
                .LongCountAsync(cancellationToken);

            var list = await root
                .OrderBy(c => c.Name)
                .Skip(pageSize * pageIndex)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            var model = CreatePaginatedListViewModel(pageSize, pageIndex, totalItems, list);

            return Ok(model);
        }

        /// <summary>
        ///     Create New Product.
        ///     In this step we'll generate file from base64 to byte[] and store it as file stream sql
        ///     TODO: Implement Auth
        /// </summary>
        /// <param name="product">
        ///     Product model
        /// </param>
        /// <param name="cancellationToken">
        ///     cancelation token
        /// </param>
        /// <returns></returns>
        // POST api/v1/Product
        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> AddNewProductAsync([FromBody] ProductViewModel product,
            CancellationToken cancellationToken)
        {
            try
            {
                if (product == null)
                    return BadRequest(new { Message = $"Cant Create Empty Product." });
                else if (product.ProductImages.Length <= 0)
                    return BadRequest(new { Message = $"Cant Create Product without image." });
                else if (product.CategoryId <= 0 || product.ManufacturerId <= 0)
                    return BadRequest(new { Message = $"Cant Create Product when category and manufacturer is not assign." });

                var productInsert = await _catalogContext.Products.SingleOrDefaultAsync(x =>
                      x.CategoryId == product.CategoryId &&
                      x.ManufacturerId == product.ManufacturerId &&
                      x.Name == product.Name, cancellationToken);

                if (productInsert != null)
                    return BadRequest(new { Message = $"Product already exists." });

                #region Initialize id for insert

                product.Id = Guid.NewGuid().ToString();

                #endregion

                #region Insert Image

                var productImages = new List<ProductImage>();
                foreach (var image in product.ProductImages)
                {
                    productImages.Add(new ProductImage()
                    {
                        ImageName = image.ImageName,
                        ProductId = product.Id
                    });
                    await InsertProductImageAsync(product, cancellationToken, image);
                }

                #endregion

                #region Product Context

                //  TODO: Replace updated by id in model.
                var item = new Product
                {
                    Description = product.Description,
                    Id = product.Id,
                    LastUpdatedBy = product.ActorId,
                    LastUpdated = DateTime.Now,
                    AvailableStock = 0,
                    Name = product.Name,
                    CategoryId = product.CategoryId,
                    ManufacturerId = product.ManufacturerId,
                    Price = product.Price,
                    OverallRating = 0,
                    TotalFavorites = 0,
                    TotalReviews = 0,
                    ProductImages = productImages,
                };
                #endregion

                #region Product Color

                if (product.ProductColors.Length > 0)
                {
                    var colors = new List<ProductColor>();
                    foreach (var color in product.ProductColors)
                    {
                        colors.Add(new ProductColor
                        {
                            Name = color.Name,
                            ProductId = product.Id
                        });
                    }

                    item.ProductColors = colors;
                }

                #endregion

                await _catalogContext.Products.AddAsync(item, cancellationToken);
                await _catalogContext.SaveChangesAsync(cancellationToken);
                return CreatedAtAction(nameof(AddNewProductAsync), new { id = item.Id }, null);
            }
            catch (Exception e)
            {
                return BadRequest(new { e.Message });
            }

        }

        private async Task InsertProductImageAsync(ProductViewModel product, CancellationToken cancellationToken,
            ProductImage image)
        {
            var file = image.ImageUrl.Split("base64,")[1];
            await _fileUtility.UploadFileAsync(@"ProductImage/" + product.Id, image.ImageName, file, cancellationToken);
        }

        /// <summary>
        ///     Update Product Data.
        ///     Image Upload Validation will be in frontend.
        ///     As User Upload Image This automatically change image url value.
        /// </summary>
        /// <param name="id">id Product</param>
        /// <param name="updateModel">Product to update</param>
        /// <param name="cancellationToken"></param>
        // PUT api/v1/Product/5
        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> UpdateProductAsync(string id, [FromBody] ProductViewModel updateModel,
            CancellationToken cancellationToken)
        {
            try
            {
                var item = await _catalogContext.Products
                    .Include(x => x.ProductImages)
                    .Include(x => x.ProductColors)
                    .SingleOrDefaultAsync(i => i.Id == id, cancellationToken);

                if (item == null) return NotFound(new { Message = $"Item with id {updateModel.Id} not found." });
                else if (updateModel.CategoryId <= 0 || updateModel.ManufacturerId <= 0)
                    return BadRequest(new { Message = $"Cant update Product when category and manufacturer is not assign." });
                else if (updateModel.ProductImages == null || updateModel.ProductImages.Length <= 0)
                    return BadRequest(new { Message = "Cant update product with 0 image" });
                
                #region Clean all Images and colors

                _catalogContext.ProductImages.RemoveRange(item.ProductImages);
                _catalogContext.ProductColors.RemoveRange(item.ProductColors);

                await _catalogContext.SaveChangesAsync(cancellationToken);

                foreach (var image in item.ProductImages)
                {
                    _fileUtility.DeleteFile("ProductImage/" + updateModel.Id, image.ImageName);
                    await InsertProductImageAsync(updateModel, cancellationToken, image);
                }
                #endregion

                #region Mapping

                item.Description = updateModel.Description;
                item.LastUpdatedBy = updateModel.ActorId;
                item.LastUpdated = DateTime.Now;
                item.Name = updateModel.Name;
                item.CategoryId = updateModel.CategoryId;
                item.ManufacturerId = updateModel.ManufacturerId;
                item.Price = updateModel.Price;
                item.ProductImages = updateModel.ProductImages;
                item.ProductColors = updateModel.ProductColors;

                #endregion

                // Update current product
                _catalogContext.Products.Update(item);

                await _catalogContext.SaveChangesAsync(cancellationToken);

                return CreatedAtAction(nameof(UpdateProductAsync), new
                {
                    id = item.Id
                }, null);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        /// <summary>
        ///     Delete Product.
        ///     Image will be deleted too.
        /// </summary>
        /// <param name="id">id Product</param>
        /// <param name="cancellationToken"></param>
        // DELETE api/v1/Product/5
        [HttpDelete("{id}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        public async Task<IActionResult> DeleteProductAsync(string id, CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrEmpty(id)) return BadRequest(new { Message = "Invalid Delete Product Request." });

                var item = await _catalogContext.Products
                    .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

                if (item != null)
                {
                    var imagesToDelete = await _catalogContext.ProductImages.Where(x => x.ProductId == item.Id)
                        .ToListAsync(cancellationToken);
                    var ratingsToDelete = await _catalogContext.ProductRatings.Where(x => x.ProductId == item.Id)
                        .ToListAsync(cancellationToken);
                    var colorsToDelete = await _catalogContext.ProductColors.Where(x => x.ProductId == item.Id)
                        .ToListAsync(cancellationToken);

                    // Delete Foreach image in directory and eventually delete folder when its empty.
                    imagesToDelete.ForEach(image => _fileUtility.DeleteFile(image.ProductId, image.ImageName));

                    // remove all product image from db
                    _catalogContext.ProductImages.RemoveRange(imagesToDelete);
                    _catalogContext.ProductRatings.RemoveRange(ratingsToDelete);
                    _catalogContext.ProductColors.RemoveRange(colorsToDelete);

                    // remove product from db
                    _catalogContext.Products.Remove(item);
                    await _catalogContext.SaveChangesAsync(cancellationToken);
                    return NoContent();
                }

                return NotFound(new { Message = $"Product with id {id} is not found." });
            }
            catch (Exception)
            {
                return BadRequest(new { Message = $"Something bad happened. Please contact your administrator." });
            }
        }

        #endregion

        #region Image

        /// <summary>
        ///     Get Image by id
        /// </summary>
        /// <param name="id">
        ///     id of Product
        /// </param>
        /// <param name="cancellationToken"></param>
        /// <returns>
        ///     return file to download
        /// </returns>
        // GET api/v1/Product/image/1
        [HttpGet("image/{id:int}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(File), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetProductImageAsync(int id, CancellationToken cancellationToken)
        {
            if (id <= 0) return BadRequest(new { Message = "invalid Image Request" });

            var item = await _catalogContext.ProductImages
                .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

            if (item != null)
            {
                var imageFileExtension = Path.GetExtension(item.ImageName);
                var mimetype = FileHelper.GetImageMimeTypeFromImageFileExtension(imageFileExtension);

                var buffer = await _fileUtility.ReadFileAsync("ProductImage/" + item.ProductId, item.ImageName, cancellationToken);

                return File(buffer, mimetype);
            }

            return NotFound();
        }

        #endregion
    }
}