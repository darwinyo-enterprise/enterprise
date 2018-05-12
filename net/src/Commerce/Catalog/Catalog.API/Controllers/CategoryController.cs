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
            IFileUtility fileUtility, IOptionsSnapshot<CatalogSettings> settings)
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
        [HttpGet] // DONE
        [ProducesResponseType(typeof(List<Category>), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllCategoriesAsync(CancellationToken cancellationToken)
        {
            var result = await _catalogContext.Categories.ToListAsync(cancellationToken);
            var withUrl = UrlImageHelper<Category>.ChangeUriPlaceholder(result, _settings.CategoryImageBaseUrl,
                _settings.AzureStorageEnabled);
            return Ok(withUrl);
        }

        /// <summary>
        ///     Fetch Single Category by Category id.
        ///     Used by admin, for Get into Category Edit Page
        ///     TODO: Implement Authorize
        /// </summary>
        /// <param name="id">Category id</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Category</returns>
        // GET api/v1/Category/5
        [HttpGet("{id}")] //Done
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(Category), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> GetCategoryByIdAsync(int id, CancellationToken cancellationToken)
        {
            if (id <= 0) return BadRequest(new {Message = $"Invalid Category id."});

            var result = await _catalogContext.Categories.Where(x => x.Id == id)
                .FirstOrDefaultAsync(cancellationToken);

            if (result != null)
            {
                var withUrl =
                    UrlImageHelper<Category>.GetImageBase64UrlAsync(result, _fileUtility, "Category",
                        cancellationToken);
                return Ok(withUrl);
            }

            return NotFound();
        }

        /// <summary>
        ///     Create New Category.
        ///     In this step we'll generate file from base64 to byte[] and store it as file stream sql
        ///     Used by admin, for Get into Category Edit Page
        ///     TODO: Implement Authorize
        ///     Validation:
        ///     Model shouldn't null
        ///     Model image url shouldn't null
        /// </summary>
        /// <param name="category">
        ///     Category model
        /// </param>
        /// <param name="cancellationToken">
        ///     cancelation token
        /// </param>
        /// <returns></returns>
        // POST api/v1/Category
        [HttpPost] //Done
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.Created)]
        public async Task<IActionResult> AddNewCategory([FromBody] Category category,
            CancellationToken cancellationToken)
        {
            #region Validations

            if (category == null)
                return BadRequest(new {Message = $"Cant Create Empty Category."});

            if (string.IsNullOrEmpty(category.ImageUrl))
                return BadRequest(new {Message = $"Cant Create Category without image ."});

            var existCategory = await _catalogContext.Categories.Where(x => x.Name == category.Name)
                .ToListAsync(cancellationToken);
            if (existCategory.Count > 0)
                return BadRequest(new {Message = $"Category with Name {category.Name} existed."});

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

            var insertedCategory =
                await _catalogContext.Categories.SingleOrDefaultAsync(x => x.Name == item.Name, cancellationToken);
            await InsertCategoryImage(category, cancellationToken, insertedCategory.Id);

            #endregion

            return CreatedAtAction(nameof(AddNewCategory), new {id = item.Id}, null);
        }

        private async Task InsertCategoryImage(Category category, CancellationToken cancellationToken,
            int id)
        {
            var file = category.ImageUrl.Split("base64,")[1];
            await _fileUtility.UploadFileAsync(@"Category/" + id, category.ImageName,
                file, cancellationToken);
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
        [HttpGet("image/{id}")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(File), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> GetCategoryImage(int id, CancellationToken cancellationToken)
        {
            if (id <= 0) return BadRequest(new {Message = $"Invalid Category Id."});

            var item = await _catalogContext.Categories
                .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

            if (item != null)
            {
                var imageFileExtension = Path.GetExtension(item.ImageName);
                var mimetype = FileHelper.GetImageMimeTypeFromImageFileExtension(imageFileExtension);

                var buffer =
                    await _fileUtility.ReadFileAsync("Category/" + item.Id, item.ImageName, cancellationToken);

                return File(buffer, mimetype);
            }

            return NotFound();
        }

        /// <summary>
        ///     Update Category Data.
        ///     Image Upload Validation will be in frontend.
        ///     As User Upload Image This automatically change image url value.
        ///     Used by admin, for Get into Category Edit Page
        ///     TODO: Implement Authorize
        /// </summary>
        /// <param name="id">id Category</param>
        /// <param name="updateModel">Category to update</param>
        /// <param name="cancellationToken"></param>
        // PUT api/v1/Category/5
        [HttpPut("{id}")] // Done
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.Created)]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category updateModel,
            CancellationToken cancellationToken)
        {
            var item = await _catalogContext.Categories
                .SingleOrDefaultAsync(i => i.Id == updateModel.Id, cancellationToken);

            if (item == null) return NotFound(new {Message = $"Item with id {updateModel.Id} not found."});
            if (string.IsNullOrEmpty(updateModel.ImageName) || string.IsNullOrEmpty(updateModel.ImageUrl))
                return BadRequest(new {Message = $"Image is empty."});
            var oldImageName = item.ImageName;

            #region Mapping

            item.ImageName = updateModel.ImageName;
            item.Description = updateModel.Description;
            item.Name = updateModel.Name;

            #endregion

            // Update current product
            _catalogContext.Categories.Update(item);

            await _catalogContext.SaveChangesAsync(cancellationToken);

            _fileUtility.DeleteFile("Category/" + updateModel.Id, oldImageName);
            await InsertCategoryImage(updateModel, cancellationToken, id);

            return CreatedAtAction(nameof(UpdateCategory), new {id = item.Id}, null);
        }

        /// <summary>
        ///     Delete Category.
        ///     Image will be deleted too.
        ///     Used by admin, for Get into Category Edit Page
        ///     TODO: Implement Authorize
        /// </summary>
        /// <param name="id">id Category</param>
        /// <param name="cancellationToken"></param>
        // DELETE api/v1/Category/5
        [HttpDelete("{id}")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.NoContent)]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            try
            {
                if (id <= 0) return BadRequest(new {Message = $"Invalid Category Id."});

                var item = await _catalogContext.Categories
                    .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

                if (item != null)
                {
                    _fileUtility.DeleteFile("Category/" + item.Id, item.ImageName);

                    _catalogContext.Categories.Remove(item);
                    await _catalogContext.SaveChangesAsync(cancellationToken);
                    return NoContent();
                }

                return NotFound(new {Message = $"Category not found."});
            }
            catch (FileNotFoundException)
            {
                return NotFound(new {Message = $"Category image not found."});
            }
            catch (Exception)
            {
                return BadRequest(new {Message = $"Something bad happened, please contact your admin."});
            }
        }
    }
}