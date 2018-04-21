using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
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
        /// <returns>list of manufacturers</returns>
        // GET api/v1/manufacturer
        [HttpGet]
        [ProducesResponseType(typeof(List<Manufacturer>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get()
        {
            var result = await _catalogContext.Manufacturers.ToListAsync();
            return Ok(result);
        }

        /// <summary>
        ///     Fetch Single Manufacturer by manufacturer id
        /// </summary>
        /// <param name="id">manufacturer id</param>
        /// <returns>manufacturer</returns>
        // GET api/v1/manufacturer/5
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(Manufacturer), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get(int id)
        {
            if (id <= 0)
            {
                return BadRequest();
            }

            var result = await _catalogContext.Manufacturers.Where(x => x.Id == id).FirstOrDefaultAsync();

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
        /// <param name="manufacturer"></param>
        /// <returns></returns>
        // POST api/v1/manufacturer
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Manufacturer manufacturer)
        {
            return null;
        }

        /// <summary>
        ///     store file upload to directory specified.
        /// </summary>
        /// <returns>
        ///     json response
        /// </returns>
        [HttpPost("image")]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> UploadFile([FromBody] UploadFileModel uploadFileModel, CancellationToken cancellationToken)
        {
            try
            {
                await FileUtility.UploadFile(_hostingEnvironment, "Manufacturer", uploadFileModel.FileName, 
                    uploadFileModel.FileBase64.Replace(@"data:image/svg+xml;base64,", ""), cancellationToken);
                return CreatedAtAction(nameof(UploadFile), uploadFileModel.FileName + " Upload Successfully.");
            }
            catch (Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }

        // PUT api/v1/manufacturer/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/v1/manufacturer/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}