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
using Microsoft.Extensions.Options;

namespace Catalog.API.Controllers
{
    [Route("api/v1/[controller]")]
    public class ManufacturerController : Controller
    {
        private readonly CatalogContext _catalogContext;
        private readonly CatalogSettings _catalogSettings;
        private readonly IHostingEnvironment _hostingEnvironment;

        public ManufacturerController(CatalogContext catalogContext, IOptionsSnapshot<CatalogSettings> settings,
            IHostingEnvironment hostingEnvironment)
        {
            _catalogContext = catalogContext ??
                              throw new ArgumentNullException(nameof(catalogContext));
            _hostingEnvironment = hostingEnvironment;
            _catalogSettings = settings.Value;
        }

        /// <summary>
        ///     Fetch All Manufacturers
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns>list of manufacturers</returns>
        // GET api/v1/manufacturer
        [HttpGet]
        [ProducesResponseType(typeof(List<Manufacturer>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get(CancellationToken cancellationToken)
        {
            var result = await _catalogContext.Manufacturers.ToListAsync(cancellationToken);
            return Ok(result);
        }

        /// <summary>
        ///     Fetch Single Manufacturer by manufacturer id
        /// </summary>
        /// <param name="id">manufacturer id</param>
        /// <param name="cancellationToken"></param>
        /// <returns>manufacturer</returns>
        // GET api/v1/manufacturer/5
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(Manufacturer), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get(int id, CancellationToken cancellationToken)
        {
            if (id <= 0)
            {
                return BadRequest();
            }

            var result = await _catalogContext.Manufacturers.Where(x => x.Id == id).FirstOrDefaultAsync(cancellationToken);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound();
        }

        /// <summary>
        ///     Create New Manufacturer.
        ///     In this step we'll generate file from base64 to byte[] and store it as file stream sql
        /// </summary>
        /// <param name="manufacturer">
        /// Manufacturer model
        /// </param>
        /// <param name="cancellationToken">
        ///cancelation token
        /// </param>
        /// <returns></returns>
        // POST api/v1/manufacturer
        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddNewManufacturer([FromBody] Manufacturer manufacturer, CancellationToken cancellationToken)
        {
            var file = manufacturer.ImageUrl.Split("base64")[1];
            await FileUtility.UploadFile(_hostingEnvironment, manufacturer.Id.ToString(), manufacturer.ImageName,
                file, cancellationToken);

            var item = new Manufacturer()
            {
                Description = manufacturer.Description,
                Id = manufacturer.Id,
                ImageName = manufacturer.ImageName,
                Name = manufacturer.Name
            };
            await _catalogContext.Manufacturers.AddAsync(item, cancellationToken);
            await _catalogContext.SaveChangesAsync(cancellationToken);
            return CreatedAtAction(nameof(AddNewManufacturer), new { id = item.Id }, null);
        }

        /// <summary>
        /// Get Image by id
        /// </summary>
        /// <param name="id">
        /// id of manufacturer
        /// </param>
        /// <param name="cancellationToken"></param>
        /// <returns>
        /// return file to download
        /// </returns>
        [HttpGet("image/id")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(File), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetImage(int id, CancellationToken cancellationToken)
        {
            if (id <= 0)
            {
                return BadRequest();
            }

            var item = await _catalogContext.Manufacturers
                .SingleOrDefaultAsync(ci => ci.Id == id, cancellationToken);

            if (item != null)
            {
                var webRoot = _hostingEnvironment.WebRootPath;
                var path = Path.Combine(webRoot, item.Id.ToString(), item.ImageName);

                string imageFileExtension = Path.GetExtension(item.ImageName);
                string mimetype = FileHelper.GetImageMimeTypeFromImageFileExtension(imageFileExtension);

                var buffer = System.IO.File.ReadAllBytes(path);

                return File(buffer, mimetype);
            }

            return NotFound();
        }
        /// <summary>
        ///     store file upload to directory specified.
        ///     this only used for updating manufacturer.
        /// </summary>
        /// <returns>
        ///     json response
        /// </returns>
        [HttpPost("image")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> UploadFile([FromBody] UploadFileModel uploadFileModel, CancellationToken cancellationToken)
        {
            try
            {
                if (Convert.ToInt32(uploadFileModel.Id) <= 0)
                {
                    return BadRequest();
                }

                // update db
                var manufacturer = await _catalogContext.Manufacturers.SingleOrDefaultAsync(x =>
                     x.Id == Convert.ToInt32(uploadFileModel.Id), cancellationToken);

                if (manufacturer != null)
                {
                    var file = uploadFileModel.FileUrl.Split("base64")[1];
                    await FileUtility.UploadFile(_hostingEnvironment, uploadFileModel.Id, uploadFileModel.FileName,
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

        [HttpDelete("image")]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        public async Task<IActionResult> DeleteImage([FromBody] UploadFileModel uploadFileModel, CancellationToken cancellationToken)
        {
            if (Convert.ToInt32(uploadFileModel.Id) <= 0)
            {
                return BadRequest();
            }

            if
            return CreatedAtAction(nameof(UploadFile), uploadFileModel.FileName + " Upload Successfully.");

            return NotFound();
        }

        /// <summary>
        /// Update Manufacturer Data.
        /// Image Upload Validation will be in frontend.
        /// As User Upload Image This automatically change image url value.
        /// </summary>
        /// <param name="id">id manufacturer</param>
        /// <param name="manufacturer">manufacturer to update</param>
        // PUT api/v1/manufacturer/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] Manufacturer manufacturer)
        {

        }

        // DELETE api/v1/manufacturer/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}