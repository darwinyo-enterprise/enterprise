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

        /// <summary>
        ///     Fetch All Manufacturers
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns>list of Manufacturers</returns>
        // GET api/v1/Manufacturer
        [HttpGet]
        [ProducesResponseType(typeof(List<Manufacturer>), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> Get(CancellationToken cancellationToken)
        {
            var result = await _catalogContext.Manufacturers.ToListAsync(cancellationToken);
            var withUrl = UrlImageHelper<Manufacturer>.ChangeUriPlaceholder(result, _settings.ManufacturerImageBaseUrl,
                _settings.AzureStorageEnabled);
            return Ok(withUrl);
        }

        /// <summary>
        ///     Fetch Single Manufacturer by Manufacturer id
        /// </summary>
        /// <param name="id">Manufacturer id</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Manufacturer</returns>
        // GET api/v1/Manufacturer/5
        [HttpGet("{id}")]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(Manufacturer), (int) HttpStatusCode.OK)]
        public async Task<IActionResult> Get(int id, CancellationToken cancellationToken)
        {
            if (id <= 0) return BadRequest();

            var result = await _catalogContext.Manufacturers.Where(x => x.Id == id)
                .FirstOrDefaultAsync(cancellationToken);

            if (result != null) return Ok(result);

            return NotFound();
        }

        /// <summary>
        ///     Create New Manufacturer.
        ///     In this step we'll generate file from base64 to byte[] and store it as file stream sql
        /// </summary>
        /// <param name="manufacturer">
        ///     Manufacturer model
        /// </param>
        /// <param name="cancellationToken">
        ///     cancelation token
        /// </param>
        /// <returns></returns>
        // POST api/v1/Manufacturer
        [HttpPost]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.Created)]
        public async Task<IActionResult> AddNewManufacturer([FromBody] Manufacturer manufacturer,
            CancellationToken cancellationToken)
        {
            if (manufacturer == null) return BadRequest();

            var file = manufacturer.ImageUrl.Split("base64")[1];
            await _fileUtility.UploadFileAsync(manufacturer.Id.ToString(), manufacturer.ImageName,
                file, cancellationToken);

            var item = new Manufacturer
            {
                Description = manufacturer.Description,
                ImageName = manufacturer.ImageName,
                Name = manufacturer.Name
            };
            await _catalogContext.Manufacturers.AddAsync(item, cancellationToken);
            await _catalogContext.SaveChangesAsync(cancellationToken);
            return CreatedAtAction(nameof(AddNewManufacturer), new {id = item.Id}, null);
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
        public async Task<IActionResult> GetImage(int id, CancellationToken cancellationToken)
        {
            if (id <= 0) return BadRequest();

            var item = await _catalogContext.Manufacturers
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
        ///     this only used for updating Manufacturer.
        /// </summary>
        /// <returns>
        ///     json response
        /// </returns>
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

                // update db
                var manufacturer = await _catalogContext.Manufacturers.SingleOrDefaultAsync(x =>
                    x.Id == Convert.ToInt32(uploadFileModel.Id), cancellationToken);

                if (manufacturer != null)
                {
                    var file = uploadFileModel.FileUrl.Split("base64")[1];
                    await _fileUtility.UploadFileAsync(uploadFileModel.Id, uploadFileModel.FileName,
                        file, cancellationToken);

                    manufacturer.ImageName = uploadFileModel.FileName;
                    _catalogContext.Manufacturers.Update(manufacturer);
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
        ///     Delete Image Manufacturer
        /// </summary>
        /// <param name="uploadFileModel">
        ///     file to delete
        /// </param>
        /// <param name="cancellationToken"></param>
        /// <returns>
        ///     no content
        /// </returns>
        [HttpDelete("image")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.NoContent)]
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
        ///     Update Manufacturer Data.
        ///     Image Upload Validation will be in frontend.
        ///     As User Upload Image This automatically change image url value.
        /// </summary>
        /// <param name="id">id Manufacturer</param>
        /// <param name="updateModel">Manufacturer to update</param>
        /// <param name="cancellationToken"></param>
        // PUT api/v1/Manufacturer/5
        [HttpPut("{id}")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.Created)]
        public async Task<IActionResult> UpdateManufacturer(int id, [FromBody] Manufacturer updateModel,
            CancellationToken cancellationToken)
        {
            var item = await _catalogContext.Manufacturers
                .SingleOrDefaultAsync(i => i.Id == updateModel.Id, cancellationToken);

            if (item == null) return NotFound(new {Message = $"Item with id {updateModel.Id} not found."});

            // Update current product
            _catalogContext.Manufacturers.Update(item);

            await _catalogContext.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(UpdateManufacturer), new {id = item.Id}, null);
        }

        /// <summary>
        ///     Delete Manufacturer.
        ///     Image will be deleted too.
        /// </summary>
        /// <param name="id">id Manufacturer</param>
        /// <param name="cancellationToken"></param>
        // DELETE api/v1/Manufacturer/5
        [HttpDelete("{id}")]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        [ProducesResponseType((int) HttpStatusCode.NoContent)]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            try
            {
                if (id <= 0) return BadRequest();

                var item = await _catalogContext.Manufacturers
                    .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

                if (item != null)
                {
                    _fileUtility.DeleteFile(item.Id.ToString(), item.ImageName);

                    _catalogContext.Manufacturers.Remove(item);
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