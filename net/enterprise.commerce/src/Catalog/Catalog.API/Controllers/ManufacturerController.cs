using System;
using System.Collections.Generic;
using Catalog.API.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Catalog.API.Controllers {
    [Route ("api/v1/[controller]")]
    public class ManufacturerController : Controller {
        private readonly CatalogContext _catalogContext;
        private readonly CatalogSettings _catalogSettings;
        public ManufacturerController (CatalogContext catalogContext, IOptionsSnapshot<CatalogSettings> settings) {
            _catalogContext = catalogContext??
            throw new ArgumentNullException (nameof (catalogContext));;
            _catalogSettings = settings.Value;

        }

        // GET api/v1/manufacturer
        [HttpGet]
        public IEnumerable<string> Get () {
            return new [] { "value1", "value2" };
        }

        // GET api/v1/manufacturer/5
        [HttpGet ("{id}")]
        public string Get (int id) {
            return "value";
        }

        // GET api/v1/manufacturer/image/5
        [HttpGet ("image/{id}")]
        public string GetImage (Guid id) {
            return "value";
        }

        // POST api/v1/manufacturer
        [HttpPost]
        public void Post ([FromBody] string value) { }

        // PUT api/v1/manufacturer/5
        [HttpPut ("{id}")]
        public void Put (int id, [FromBody] string value) { }

        // DELETE api/v1/manufacturer/5
        [HttpDelete ("{id}")]
        public void Delete (int id) { }
    }
}