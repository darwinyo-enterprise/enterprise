﻿using System;
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
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Catalog.API.Controllers
{
    [Produces("application/json")]
    [Route("api/v1/[controller]")]
    public class CategoryController : Controller
    {
        private readonly CatalogContext _catalogContext;
        private readonly IFileUtility _fileUtility;
        private readonly CatalogSettings _settings;

        public CategoryController(CatalogContext catalogContext,
            IOptionsSnapshot<CatalogSettings> settings,
            IFileUtility fileUtility)
        {
            _catalogContext = catalogContext ??
                              throw new ArgumentNullException(nameof(catalogContext));
            _fileUtility = fileUtility;
            _settings = settings.Value;
        }

        /// <summary>
        ///     Fetch All Categories
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns>list of Categories</returns>
        // GET api/v1/Category
        [HttpGet]
        [ProducesResponseType(typeof(List<Category>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get(CancellationToken cancellationToken)
        {
            var result = await _catalogContext.Categories.ToListAsync(cancellationToken);
            var withUrl = UrlImageHelper<Category>.ChangeUriPlaceholder(result, _settings.CategoryImageBaseUrl,
                _settings.AzureStorageEnabled);
            return Ok(withUrl);
        }

        /// <summary>
        ///     Fetch Single Category by Category id
        /// </summary>
        /// <param name="id">Category id</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Category</returns>
        // GET api/v1/Category/5
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(Category), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get(int id, CancellationToken cancellationToken)
        {
            if (id <= 0) return BadRequest();

            var result = await _catalogContext.Categories.Where(x => x.Id == id)
                .FirstOrDefaultAsync(cancellationToken);

            if (result != null) return Ok(result);

            return NotFound();
        }

        /// <summary>
        ///     Create New Category.
        ///     In this step we'll generate file from base64 to byte[] and store it as file stream sql
        /// </summary>
        /// <param name="category">
        ///     Category model
        /// </param>
        /// <param name="cancellationToken">
        ///     cancelation token
        /// </param>
        /// <returns></returns>
        // POST api/v1/Category
        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddNewCategory([FromBody] Category category,
            CancellationToken cancellationToken)
        {
            #region Validations
            if (category == null) return BadRequest();

            var existCategory = await _catalogContext.Categories.Where(x => x.Name == category.Name).ToListAsync(cancellationToken);
            if (existCategory != null)
            {
                ModelState.AddModelError("Category name", string.Format("Category with Name {0} existed", category.Name));
                return BadRequest(ModelState);
            }
            #endregion

            #region Creation

            var item = new Category
            {
                Description = category.Description,
                ImageName = category.ImageName,
                Name = category.Name
            };
            await _catalogContext.Categories.AddAsync(item, cancellationToken);
            await _catalogContext.SaveChangesAsync(cancellationToken);

            var insertedCategory = await _catalogContext.Categories.SingleOrDefaultAsync(x => x.Name == item.Name, cancellationToken);
            var file = category.ImageUrl.Split("base64,")[1];
            await _fileUtility.UploadFileAsync(@"Category/" + insertedCategory.Id.ToString(), category.ImageName,
                file, cancellationToken);

            #endregion


            return CreatedAtAction(nameof(AddNewCategory), new { id = item.Id }, null);
        }

        /// <summary>
        ///     Get Image by id
        /// </summary>
        /// <param name="id">
        ///     id of Category
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

            var item = await _catalogContext.Categories
                .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

            if (item != null)
            {
                var imageFileExtension = Path.GetExtension(item.ImageName);
                var mimetype = FileHelper.GetImageMimeTypeFromImageFileExtension(imageFileExtension);

                var buffer = await _fileUtility.ReadFileAsync(item.Id.ToString(), item.ImageName, cancellationToken);

                return File(buffer, mimetype);
            }

            return NotFound();
        }

        /// <summary>
        ///     store file upload to directory specified.
        ///     this only used for updating Category.
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
                var category = await _catalogContext.Categories.SingleOrDefaultAsync(x =>
                    x.Id == Convert.ToInt32(uploadFileModel.Id), cancellationToken);

                if (category != null)
                {
                    var file = uploadFileModel.FileUrl.Split("base64,")[1];
                    await _fileUtility.UploadFileAsync(uploadFileModel.Id, uploadFileModel.FileName,
                        file, cancellationToken);

                    category.ImageName = uploadFileModel.FileName;
                    _catalogContext.Categories.Update(category);
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
        ///     Delete Image Category
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

                _fileUtility.DeleteFile(uploadFileModel.Id, uploadFileModel.FileName);

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
        ///     Update Category Data.
        ///     Image Upload Validation will be in frontend.
        ///     As User Upload Image This automatically change image url value.
        /// </summary>
        /// <param name="id">id Category</param>
        /// <param name="updateModel">Category to update</param>
        /// <param name="cancellationToken"></param>
        // PUT api/v1/Category/5
        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category updateModel,
            CancellationToken cancellationToken)
        {
            var item = await _catalogContext.Categories
                .SingleOrDefaultAsync(i => i.Id == updateModel.Id, cancellationToken);

            if (item == null) return NotFound(new { Message = $"Item with id {updateModel.Id} not found." });

            // Update current product
            _catalogContext.Categories.Update(item);

            await _catalogContext.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(UpdateCategory), new { id = item.Id }, null);
        }

        /// <summary>
        ///     Delete Category.
        ///     Image will be deleted too.
        /// </summary>
        /// <param name="id">id Category</param>
        /// <param name="cancellationToken"></param>
        // DELETE api/v1/Category/5
        [HttpDelete("{id}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            try
            {
                if (id <= 0) return BadRequest();

                var item = await _catalogContext.Categories
                    .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

                if (item != null)
                {
                    _fileUtility.DeleteFile(item.Id.ToString(), item.ImageName);

                    _catalogContext.Categories.Remove(item);
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