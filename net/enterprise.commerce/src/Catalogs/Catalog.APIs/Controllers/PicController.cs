using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.Controllers
{
    [Produces("application/json")]
    [Route("api/v1/pic")]
    public class PicController : Controller
    {
        // GET: api/v1/pic
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new[] {"value1", "value2"};
        }

        // GET: api/v1/pic/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/v1/pic
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/v1/pic/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/v1/pic/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}