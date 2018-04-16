using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Catalog.API.Infrastructure;
using Catalog.API.Models;
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
        public ManufacturerController(CatalogContext catalogContext, IOptionsSnapshot<CatalogSettings> settings)
        {
            _catalogContext = catalogContext ??
            throw new ArgumentNullException(nameof(catalogContext)); ;
            _catalogSettings = settings.Value;

        }

        /// <summary>
        /// Fetch All Manufacturers
        /// </summary>
        /// <returns>list of manufacturers</returns>
        // GET api/v1/manufacturer
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _catalogContext.Manufacturers.ToListAsync();
            return Ok(result);
        }

        /// <summary>
        /// Fetch Single Manufacturer by manufacturer id
        /// </summary>
        /// <param name="id">manufacturer id</param>
        /// <returns>manufacturer</returns>
        // GET api/v1/manufacturer/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _catalogContext.Manufacturers.Where(x => x.Id == id).FirstOrDefaultAsync();
            return Ok(result);
        }

        // GET api/v1/manufacturer/image/5
        [HttpGet("image/{id}")]
        public string GetImage(Guid id)
        {
            return "value";
        }

        /// <summary>
        /// Create New Manufacturer.
        /// In this step we'll generate file from base64 to byte[] and store it as file stream sql
        /// </summary>
        /// <param name="manufacturer"></param>
        /// <returns></returns>
        // POST api/v1/manufacturer
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Manufacturer manufacturer)
        {
            return null;
        }

        // PUT api/v1/manufacturer/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value) { }

        // DELETE api/v1/manufacturer/5
        [HttpDelete("{id}")]
        public void Delete(int id) { }
    }
}