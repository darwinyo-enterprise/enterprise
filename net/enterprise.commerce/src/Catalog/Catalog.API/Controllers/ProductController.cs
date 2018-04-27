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
using Enterprise.Library.FileUtility;
using Enterprise.Library.FileUtility.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Catalog.API.Controllers
{
    [Produces("application/json")]
    [Route("api/v1/[controller]")]
    public class ProductController : Controller
    {
        private readonly CatalogContext _catalogContext;
        private readonly IHostingEnvironment _hostingEnvironment;

        public ProductController(CatalogContext catalogContext,
            IHostingEnvironment hostingEnvironment)
        {
            _catalogContext = catalogContext ??
                              throw new ArgumentNullException(nameof(catalogContext));
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        ///     Fetch All Products
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns>list of Products</returns>
        // GET api/v1/Product
        [HttpGet]
        [ProducesResponseType(typeof(List<Product>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get(CancellationToken cancellationToken)
        {
            var result = await _catalogContext.Products.ToListAsync(cancellationToken);
            return Ok(result);
        }

        /// <summary>
        ///     Fetch Single Product by Product id
        /// </summary>
        /// <param name="id">Product id</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Product</returns>
        // GET api/v1/Product/5
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(Product), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
        {
            if (id == new Guid()) return BadRequest();

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
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddNewProduct([FromBody] Product product,
            CancellationToken cancellationToken)
        {
            var file = product.ImageUrl.Split("base64")[1];
            await FileUtility.UploadFile(_hostingEnvironment, product.Id.ToString(), product.ImageName,
                file, cancellationToken);

            var item = new Product
            {
                Description = product.Description,
                Id = product.Id,
                ImageName = product.ImageName,
                Name = product.Name
            };
            await _catalogContext.Products.AddAsync(item, cancellationToken);
            await _catalogContext.SaveChangesAsync(cancellationToken);
            return CreatedAtAction(nameof(AddNewProduct), new { id = item.Id }, null);
        }

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
        [HttpGet("image/id")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(File), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetImage(int id, CancellationToken cancellationToken)
        {
            if (id <= 0) return BadRequest();

            var item = await _catalogContext.Products
                .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

            if (item != null)
            {
                var webRoot = _hostingEnvironment.WebRootPath;
                var path = Path.Combine(webRoot, item.Id.ToString(), item.ImageName);

                var imageFileExtension = Path.GetExtension(item.ImageName);
                var mimetype = FileHelper.GetImageMimeTypeFromImageFileExtension(imageFileExtension);

                var buffer = System.IO.File.ReadAllBytes(path);

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
        [HttpPost("image")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> UploadFile([FromBody] UploadFileModel uploadFileModel,
            CancellationToken cancellationToken)
        {
            try
            {
                if (Convert.ToInt32(uploadFileModel.Id) <= 0) return BadRequest();

                // update db
                var Product = await _catalogContext.Products.SingleOrDefaultAsync(x =>
                    x.Id == Convert.ToInt32(uploadFileModel.Id), cancellationToken);

                if (Product != null)
                {
                    var file = uploadFileModel.FileUrl.Split("base64")[1];
                    await FileUtility.UploadFile(_hostingEnvironment, uploadFileModel.Id, uploadFileModel.FileName,
                        file, cancellationToken);

                    Product.ImageName = uploadFileModel.FileName;
                    _catalogContext.Products.Update(Product);
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
        [HttpDelete("image")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        public IActionResult DeleteImage([FromBody] UploadFileModel uploadFileModel,
            CancellationToken cancellationToken)
        {
            try
            {
                if (Convert.ToInt32(uploadFileModel.Id) <= 0) return BadRequest();

                var webRoot = _hostingEnvironment.WebRootPath;
                var path = Path.Combine(webRoot, uploadFileModel.Id, uploadFileModel.FileName);

                System.IO.File.Delete(path);

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
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product updateModel,
            CancellationToken cancellationToken)
        {
            var item = await _catalogContext.Products
                .SingleOrDefaultAsync(i => i.Id == updateModel.Id, cancellationToken);

            if (item == null) return NotFound(new { Message = $"Item with id {updateModel.Id} not found." });

            // Update current product
            _catalogContext.Products.Update(item);

            await _catalogContext.SaveChangesAsync();

            return CreatedAtAction(nameof(UpdateProduct), new { id = item.Id }, null);
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
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            try
            {
                if (id <= 0) return BadRequest();

                var item = await _catalogContext.Products
                    .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

                if (item != null)
                {
                    var webRoot = _hostingEnvironment.WebRootPath;
                    var path = Path.Combine(webRoot, item.Id.ToString(), item.ImageName);

                    System.IO.File.Delete(path);

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
    }
}