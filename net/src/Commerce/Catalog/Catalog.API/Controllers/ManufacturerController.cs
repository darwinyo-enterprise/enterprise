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
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Catalog.API.Controllers
{
    /// <summary>
    ///  V1 Requirements
    ///  1. Add new manufacturer will also create file image
    ///  2. Update manufacturer will delete previous image and insert new image
    ///  3. Delete manufacturer will delete image too
    ///  4. Get manufacturer will pass url image
    ///  5. Get all manufacturers will pass each url image
    ///  Required Authorization
    ///  1. Update
    ///  2. Delete
    ///  3. Add
    /// </summary>
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
        [ProducesResponseType(typeof(List<Manufacturer>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllManufacturersAsync(CancellationToken cancellationToken)
        {
            var result = await _catalogContext.Manufacturers.ToListAsync(cancellationToken);
            var withUrl = UrlImageHelper<Manufacturer>.ChangeUriPlaceholder(result, _settings.ManufacturerImageBaseUrl,
                _settings.AzureStorageEnabled);
            return Ok(withUrl);
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
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(Manufacturer), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetManufacturerByIdAsync(int id, CancellationToken cancellationToken)
        {
            if (id <= 0) return BadRequest();

            var result = await _catalogContext.Manufacturers.Where(x => x.Id == id)
                .FirstOrDefaultAsync(cancellationToken);

            if (result != null)
            {
                var withUrl = UrlImageHelper<Manufacturer>.GetImageBase64UrlAsync(result, _fileUtility, "Manufacturer", cancellationToken);
                return Ok(withUrl);
            }

            return NotFound();
        }

        /// <summary>
        ///     Create New Manufacturer.
        ///     In this step we'll generate file from base64 to byte[] and store it as file stream sql
        ///     Used by admin, for Get into Manufacturer Edit Page
        ///     TODO: Implement Authorize
        /// 
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
        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddNewManufacturer([FromBody] Manufacturer manufacturer,
            CancellationToken cancellationToken)
        {
            #region Validations
            if (manufacturer == null)
                return BadRequest(new { Message = $"Cant Create Empty Manufacturer." });

            if (string.IsNullOrEmpty(manufacturer.ImageUrl))
                return BadRequest(new { Message = $"Cant Create Manufacturer without image ." });

            var existManufacturer = await _catalogContext.Manufacturers.Where(x => x.Name == manufacturer.Name)
                .ToListAsync(cancellationToken);
            if (existManufacturer != null)
                return BadRequest(new { Message = $"Manufacturer with Name {manufacturer.Name} existed." });

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
            await InsertManufacturerImage(manufacturer, cancellationToken, insertedManufacturer.Id);
            #endregion

            return CreatedAtAction(nameof(AddNewManufacturer), new { id = item.Id }, null);
        }

        private async Task InsertManufacturerImage(Manufacturer manufacturer, CancellationToken cancellationToken,
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
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(File), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetManufacturerImage(int id, CancellationToken cancellationToken)
        {
            if (id <= 0) return BadRequest();

            var item = await _catalogContext.Manufacturers
                .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

            if (item != null)
            {
                var imageFileExtension = Path.GetExtension(item.ImageName);
                var mimetype = FileHelper.GetImageMimeTypeFromImageFileExtension(imageFileExtension);

                var buffer = await _fileUtility.ReadFileAsync("Manufacturer/" + item.Id.ToString(), item.ImageName, cancellationToken);

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
        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> UpdateManufacturer(int id, [FromBody] Manufacturer updateModel,
            CancellationToken cancellationToken)
        {
            var item = await _catalogContext.Manufacturers
                .SingleOrDefaultAsync(i => i.Id == updateModel.Id, cancellationToken);

            if (item == null) return NotFound(new { Message = $"Item with id {updateModel.Id} not found." });

            string oldImageName = item.ImageName;

            #region Mapping

            item.ImageName = updateModel.ImageName;
            item.Description = updateModel.Description;
            item.Name = updateModel.Name;

            #endregion
            // Update current product
            _catalogContext.Manufacturers.Update(item);

            await _catalogContext.SaveChangesAsync(cancellationToken);

            _fileUtility.DeleteFile("Manufacturer/" + updateModel.Id.ToString(), oldImageName);
            await InsertManufacturerImage(updateModel, cancellationToken, id);

            return CreatedAtAction(nameof(UpdateManufacturer), new { id = item.Id }, null);
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
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
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