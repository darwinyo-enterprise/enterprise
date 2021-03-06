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
using Catalog.API.ViewModels;
using Enterprise.Library.FileUtility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Catalog.API.Controllers
{
    [Produces("application/json")]
    [Route("api/v1/[controller]")]
    public class ManufacturerController : Controller
    {
        private readonly CatalogContext _catalogContext;
        private readonly IFileUtility _fileUtility;
        private readonly CatalogSettings _settings;

        public ManufacturerController(CatalogContext catalogContext,
            IFileUtility fileUtility, IOptionsSnapshot<CatalogSettings> settings)
        {
            _catalogContext = catalogContext ??
                              throw new ArgumentNullException(nameof(catalogContext));
            _fileUtility = fileUtility;
            _settings = settings.Value;
        }

        private PaginatedListViewModel<ItemViewModel> CreatePaginatedListViewModel(int pageSize,
            int pageIndex, long totalItems, List<Manufacturer> list)
        {
            var page = new List<ItemViewModel>();
            list.ForEach(x =>
            {
                page.Add(new ItemViewModel
                {
                    Id = x.Id.ToString(),
                    Name = x.Name
                });
            });

            var model = new PaginatedListViewModel<ItemViewModel>(
                pageIndex, pageSize, totalItems, page);
            return model;
        }

        /// <summary>
        ///     Fetch All Manufacturers
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns>list of Manufacturers</returns>
        // GET api/v1/Manufacturer
        [HttpGet] // DONE
        [ProducesResponseType(typeof(List<Manufacturer>), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllManufacturersAsync(CancellationToken cancellationToken)
        {
            var result = await _catalogContext.Manufacturers.ToListAsync(cancellationToken);
            var withUrl = UrlImageHelper<Manufacturer>.ChangeUriPlaceholder(result, _settings.ManufacturerImageBaseUrl,
                _settings.AzureStorageEnabled);
            return Ok(withUrl);
        }

        /// <summary>
        ///     Fetch Paginated Manufacturers
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns>list of Manufacturers</returns>
        // GET api/v1/Manufacturer[?pageSize=3&pageIndex=10]
        [HttpGet("paginated")] // DONE
        [ProducesResponseType(typeof(List<Manufacturer>), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> GetPaginatedManufacturersAsync(CancellationToken cancellationToken,
            [FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 0)
        {
            var result = await _catalogContext.Manufacturers
                .Skip(pageSize * pageIndex)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
            var withUrl = UrlImageHelper<Manufacturer>.ChangeUriPlaceholder(result, _settings.ManufacturerImageBaseUrl,
                _settings.AzureStorageEnabled);
            return Ok(withUrl);
        }

        /// <summary>
        ///     Fetch All Manufacturers Used for Admin Management.
        ///     TODO: Implement Authorization
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <param name="pageSize"></param>
        /// <param name="pageIndex"></param>
        /// <returns>Manufacturer</returns>
        // GET api/v1/Manufacturer/list
        [HttpGet("list")]
        [Authorize(Policy = "Admin")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(PaginatedListViewModel<ItemViewModel>), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> GetListManufacturersAsync(CancellationToken cancellationToken,
            [FromQuery] int pageSize = 10,
            [FromQuery] int pageIndex = 0)
        {
            if (pageIndex < 0 || pageSize <= 0) return BadRequest(new {Message = $"Invalid pagination request."});

            var root = (IQueryable<Manufacturer>) _catalogContext.Manufacturers;

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
        ///     Fetch Single Manufacturer by Manufacturer id.
        ///     Used by admin, for Get into Manufacturer Edit Page
        ///     TODO: Implement Authorize
        /// </summary>
        /// <param name="id">Manufacturer id</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Manufacturer</returns>
        // GET api/v1/Manufacturer/5
        [HttpGet("{id}")] //Done
        [Authorize(Policy = "Admin")]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(Manufacturer), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> GetManufacturerByIdAsync(int id, CancellationToken cancellationToken)
        {
            if (id <= 0) return BadRequest(new {Message = $"Invalid Manufacturer id."});

            var result = await _catalogContext.Manufacturers.Where(x => x.Id == id)
                .FirstOrDefaultAsync(cancellationToken);

            if (result != null)
            {
                var withUrl =
                    await UrlImageHelper<Manufacturer>.GetImageBase64UrlAsync(result, _fileUtility, "Manufacturer",
                        cancellationToken);
                return Ok(withUrl);
            }

            return NotFound();
        }

        /// <summary>
        ///     Create New Manufacturer.
        ///     In this step we'll generate file from base64 to byte[] and store it as file stream sql
        ///     Used by admin, for Get into Manufacturer Edit Page
        ///     TODO: Implement Authorize
        ///     Validation:
        ///     Model shouldn't null
        ///     Model image url shouldn't null
        /// </summary>
        /// <param name="manufacturer">
        ///     Manufacturer model
        /// </param>
        /// <param name="cancellationToken">
        ///     cancelation token
        /// </param>
        /// <returns></returns>
        // POST api/v1/Manufacturer
        [HttpPost] //Done
        [Authorize(Policy = "Admin")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.Created)]
        public async Task<IActionResult> AddNewManufacturerAsync([FromBody] Manufacturer manufacturer,
            CancellationToken cancellationToken)
        {
            #region Validations

            if (manufacturer == null)
                return BadRequest(new {Message = $"Cant Create Empty Manufacturer."});

            if (string.IsNullOrEmpty(manufacturer.ImageUrl))
                return BadRequest(new {Message = $"Cant Create Manufacturer without image ."});

            var existManufacturer = await _catalogContext.Manufacturers.Where(x => x.Name == manufacturer.Name)
                .ToListAsync(cancellationToken);
            if (existManufacturer.Count > 0)
                return BadRequest(new {Message = $"Manufacturer with Name {manufacturer.Name} existed."});

            #endregion

            #region Creation

            var item = new Manufacturer
            {
                Description = manufacturer.Description,
                ImageName = manufacturer.ImageName,
                Name = manufacturer.Name
            };

            await _catalogContext.Manufacturers.AddAsync(item, cancellationToken);
            await _catalogContext.SaveChangesAsync(cancellationToken);

            var insertedManufacturer =
                await _catalogContext.Manufacturers.SingleOrDefaultAsync(x => x.Name == item.Name, cancellationToken);
            await InsertManufacturerImageAsync(manufacturer, cancellationToken, insertedManufacturer.Id);

            #endregion

            return CreatedAtAction(nameof(AddNewManufacturerAsync), new {id = item.Id}, null);
        }

        private async Task InsertManufacturerImageAsync(Manufacturer manufacturer, CancellationToken cancellationToken,
            int id)
        {
            var file = manufacturer.ImageUrl.Split("base64,")[1];
            await _fileUtility.UploadFileAsync(@"Manufacturer/" + id, manufacturer.ImageName,
                file, cancellationToken);
        }

        /// <summary>
        ///     Get Image by id
        /// </summary>
        /// <param name="id">
        ///     id of Manufacturer
        /// </param>
        /// <param name="cancellationToken"></param>
        /// <returns>
        ///     return file to download
        /// </returns>
        [HttpGet("image/{id}")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(File), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> GetManufacturerImageAsync(int id, CancellationToken cancellationToken)
        {
            if (id <= 0) return BadRequest(new {Message = $"Invalid Manufacturer Id."});

            var item = await _catalogContext.Manufacturers
                .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

            if (item != null)
            {
                var imageFileExtension = Path.GetExtension(item.ImageName);
                var mimetype = FileHelper.GetImageMimeTypeFromImageFileExtension(imageFileExtension);

                var buffer =
                    await _fileUtility.ReadFileAsync("Manufacturer/" + item.Id, item.ImageName, cancellationToken);

                return File(buffer, mimetype);
            }

            return NotFound();
        }

        /// <summary>
        ///     Update Manufacturer Data.
        ///     Image Upload Validation will be in frontend.
        ///     As User Upload Image This automatically change image url value.
        ///     Used by admin, for Get into Manufacturer Edit Page
        ///     TODO: Implement Authorize
        /// </summary>
        /// <param name="id">id Manufacturer</param>
        /// <param name="updateModel">Manufacturer to update</param>
        /// <param name="cancellationToken"></param>
        // PUT api/v1/Manufacturer/5
        [HttpPut("{id}")] // Done
        [Authorize(Policy = "Admin")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.Created)]
        public async Task<IActionResult> UpdateManufacturerAsync(int id, [FromBody] Manufacturer updateModel,
            CancellationToken cancellationToken)
        {
            var item = await _catalogContext.Manufacturers
                .SingleOrDefaultAsync(i => i.Id == id, cancellationToken);

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
            _catalogContext.Manufacturers.Update(item);

            await _catalogContext.SaveChangesAsync(cancellationToken);

            _fileUtility.DeleteFile("Manufacturer/" + updateModel.Id, oldImageName);
            await InsertManufacturerImageAsync(updateModel, cancellationToken, id);

            return CreatedAtAction(nameof(UpdateManufacturerAsync), new {id = item.Id}, null);
        }

        /// <summary>
        ///     Delete Manufacturer.
        ///     Image will be deleted too.
        ///     Used by admin, for Get into Manufacturer Edit Page
        ///     TODO: Implement Authorize
        /// </summary>
        /// <param name="id">id Manufacturer</param>
        /// <param name="cancellationToken"></param>
        // DELETE api/v1/Manufacturer/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.NoContent)]
        public async Task<IActionResult> DeleteManufacturerAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                if (id <= 0) return BadRequest(new {Message = $"Invalid Manufacturer Id."});

                var item = await _catalogContext.Manufacturers
                    .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

                if (item != null)
                {
                    _catalogContext.Manufacturers.Remove(item);
                    await _catalogContext.SaveChangesAsync(cancellationToken);
                    _fileUtility.DeleteFile("Manufacturer/" + item.Id, item.ImageName);
                    return NoContent();
                }

                return NotFound(new {Message = $"Manufacturer not found."});
            }
            catch (DbUpdateException)
            {
                return BadRequest(
                    new {Message = $"Please remove all products that related to this manufacturer first."});
            }
            catch (FileNotFoundException)
            {
                return NotFound(new {Message = $"Manufacturer image not found."});
            }
            catch (Exception)
            {
                return BadRequest(new {Message = $"Something bad happened, please contact your admin."});
            }
        }
    }
}