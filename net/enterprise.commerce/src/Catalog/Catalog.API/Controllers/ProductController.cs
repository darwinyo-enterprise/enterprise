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
using Enterprise.Library.FileUtility.Models;
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

        public ProductController(CatalogContext catalogContext, IOptionsSnapshot<CatalogSettings> settings,
            IFileUtility fileUtility)
        {
            _catalogContext = catalogContext ??
                              throw new ArgumentNullException(nameof(catalogContext));
            _fileUtility = fileUtility;
            _settings = settings.Value;
        }

        /// <summary>
        ///     Fetch All Paginated Products By Page size and page index
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="cancellationToken"></param>
        /// <param name="pageSize"></param>
        /// <returns>list of Products</returns>
        // GET api/v1/Product[?pageSize=3&pageIndex=10]
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCatalogViewModel<CatalogItemViewModel>), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> GetPaginatedCatalog(CancellationToken cancellationToken,
            [FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 0)
        {
            var totalItems = await _catalogContext.Products
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
        ///     Fetch All Paginated Products By Page size and page index with name
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <param name="name"></param>
        /// <param name="pageSize"></param>
        /// <param name="pageIndex"></param>
        /// <returns>list of Products</returns>
        // GET api/v1/Product/query/Mac[?pageSize=3&pageIndex=10]
        [HttpGet("query/{name:minlength(1)}")]
        [ProducesResponseType(typeof(PaginatedCatalogViewModel<CatalogItemViewModel>), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> GetPaginatedCatalogByName(CancellationToken cancellationToken, string name,
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
        [ProducesResponseType(typeof(PaginatedCatalogViewModel<CatalogItemViewModel>), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> GetPaginatedCatalogByCategoryOrManufacturer(
            CancellationToken cancellationToken, int? idCategory, int? idManufacturer, [FromQuery] int pageSize = 10,
            [FromQuery] int pageIndex = 0)
        {
            var root = (IQueryable<Product>) _catalogContext.Products;

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

        /// <summary>
        ///     store file upload to directory specified.
        ///     this only used for updating Product.
        /// </summary>
        /// <returns>
        ///     json response
        /// </returns>
        // POST api/v1/Product/inventory[?id=3&amount=10]
        [HttpPost("inventory")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.Created)]
        public async Task<IActionResult> UpdateInventory(string id, int amount,
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

                    return CreatedAtAction(nameof(UploadFile), product.Name + " Upload Successfully.");
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
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.Created)]
        public async Task<IActionResult> RateProduct([FromBody] ProductRateViewModel productRateViewModel,
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

                    return CreatedAtAction(nameof(UploadFile), product.Name + " Upload Successfully.");
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }

        #region Product

        /// <summary>
        ///     Fetch Single Product by Product id
        /// </summary>
        /// <param name="id">Product id</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Product</returns>
        // GET api/v1/Product/5
        [HttpGet("{id}")]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(Product), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> Get(string id, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(id)) return BadRequest();

            var result = await _catalogContext.Products.Where(x => x.Id == id)
                .FirstOrDefaultAsync(cancellationToken);

            if (result != null) return Ok(result);

            return NotFound();
        }

        /// <summary>
        ///     Create New Product.
        ///     In this step we'll generate file from base64 to byte[] and store it as file stream sql
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
        [ProducesResponseType((int) HttpStatusCode.Created)]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        public async Task<IActionResult> AddNewProduct([FromBody] Product product,
            CancellationToken cancellationToken)
        {
            if (product == null ||
                product.ProductImages.Count <= 0 ||
                product.CategoryId <= 0 ||
                product.ManufacturerId <= 0) return BadRequest();

            #region Initialize id for insert

            product.Id = Guid.NewGuid().ToString();

            #endregion

            #region Insert Image

            foreach (var image in product.ProductImages)
            {
                // Initialize id
                image.ProductId = product.Id;
                await _fileUtility.UploadFileAsync(image.ProductId, image.ImageName, image.ImageUrl, cancellationToken);
            }

            #endregion

            #region Product Context

            //  TODO: Replace updated by id in model.
            var item = new Product
            {
                Description = product.Description,
                Id = product.Id,
                LastUpdatedBy = "1",
                LastUpdated = DateTime.Now,
                AvailableStock = 0,
                Name = product.Name,
                CategoryId = product.CategoryId,
                ManufacturerId = product.ManufacturerId,
                Price = product.Price,
                OverallRating = 0,
                TotalFavorites = 0,
                TotalReviews = 0,
                ProductImages = product.ProductImages
            };


            if (product.ProductColors.Count > 0) item.ProductColors = product.ProductColors;
            await _catalogContext.Products.AddAsync(item, cancellationToken);

            #endregion

            await _catalogContext.SaveChangesAsync(cancellationToken);
            return CreatedAtAction(nameof(AddNewProduct), new {id = item.Id}, null);
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
        [HttpPut("{id:int}")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.Created)]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product updateModel,
            CancellationToken cancellationToken)
        {
            var item = await _catalogContext.Products
                .SingleOrDefaultAsync(i => i.Id == updateModel.Id, cancellationToken);

            if (item == null) return NotFound(new {Message = $"Item with id {updateModel.Id} not found."});

            #region Mapping

            item.Description = updateModel.Description;
            // TODO: Replace this to proper value.
            item.LastUpdatedBy = "1";
            item.LastUpdated = DateTime.Now;
            item.Name = updateModel.Name;
            item.CategoryId = updateModel.CategoryId;
            item.ManufacturerId = updateModel.ManufacturerId;
            item.Price = updateModel.Price;

            if (updateModel.ProductColors.Count > 0) item.ProductColors = updateModel.ProductColors;

            #endregion

            // Update current product
            _catalogContext.Products.Update(item);

            await _catalogContext.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(UpdateProduct), new
            {
                id = item.Id
            }, null);
        }

        /// <summary>
        ///     Delete Product.
        ///     Image will be deleted too.
        /// </summary>
        /// <param name="id">id Product</param>
        /// <param name="cancellationToken"></param>
        // DELETE api/v1/Product/5
        [HttpDelete("{id}")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.NoContent)]
        public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrEmpty(id)) return BadRequest();

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

                return NotFound();
            }
            catch (FileNotFoundException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return BadRequest();
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
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(File), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> GetImage(int id, CancellationToken cancellationToken)
        {
            if (id <= 0) return BadRequest();

            var item = await _catalogContext.ProductImages
                .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

            if (item != null)
            {
                var imageFileExtension = Path.GetExtension(item.ImageName);
                var mimetype = FileHelper.GetImageMimeTypeFromImageFileExtension(imageFileExtension);

                var buffer = await _fileUtility.ReadFileAsync(item.ProductId, item.ImageName, cancellationToken);

                return File(buffer, mimetype);
            }

            return NotFound();
        }

        /// <summary>
        ///     store file upload to directory specified.
        ///     this only used for updating Product.
        /// </summary>
        /// <returns>
        ///     json response
        /// </returns>
        // POST api/v1/Product/image
        [HttpPost("image")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.Created)]
        public async Task<IActionResult> UploadFile([FromBody] UploadFileModel uploadFileModel,
            CancellationToken cancellationToken)
        {
            try
            {
                if (Convert.ToInt32(uploadFileModel.Id) <= 0) return BadRequest();

                // select db
                var product = await _catalogContext.Products.SingleOrDefaultAsync(x =>
                    x.Id == uploadFileModel.Id, cancellationToken);

                if (product != null)
                {
                    var file = uploadFileModel.FileUrl.Split("base64")[1];
                    await _fileUtility.UploadFileAsync(uploadFileModel.Id, uploadFileModel.FileName,
                        file, cancellationToken);

                    var image = new ProductImage
                    {
                        ProductId = product.Id,
                        ImageName = uploadFileModel.FileName
                    };

                    // add new entity to db
                    await _catalogContext.ProductImages.AddAsync(image, cancellationToken);

                    // update product entity to db
                    product.ProductImages.Add(image);
                    _catalogContext.Products.Update(product);

                    await _catalogContext.SaveChangesAsync(cancellationToken);

                    return CreatedAtAction(nameof(UploadFile), uploadFileModel.FileName + " Upload Successfully.");
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }

        /// <summary>
        ///     Delete Image Product
        /// </summary>
        /// <param name="uploadFileModel">
        ///     file to delete
        /// </param>
        /// <param name="cancellationToken"></param>
        /// <returns>
        ///     no content
        /// </returns>
        // DELETE api/v1/Product/image
        [HttpDelete("image")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.NoContent)]
        public async Task<IActionResult> DeleteImage([FromBody] UploadFileModel uploadFileModel,
            CancellationToken cancellationToken)
        {
            try
            {
                if (Convert.ToInt32(uploadFileModel.Id) <= 0) return BadRequest();

                _fileUtility.DeleteFile(uploadFileModel.Id, uploadFileModel.FileName);

                var imageToDelete =
                    await _catalogContext.ProductImages.SingleOrDefaultAsync(
                        x => x.Id == Convert.ToInt32(uploadFileModel.Id), cancellationToken);
                _catalogContext.ProductImages.Remove(imageToDelete);

                await _catalogContext.SaveChangesAsync(cancellationToken);
                return NoContent();
            }
            catch (FileNotFoundException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        #endregion
    }
}