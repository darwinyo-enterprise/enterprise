using System.Collections.Generic;
using System.Linq;
using System.Net;
using Enterprise.Library.IntegrationEventLog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Order.API.Controllers
{
    [Authorize]
    public class IntegrationEventController : Controller
    {
        private readonly IntegrationEventLogContext _context;
        public IntegrationEventController(IntegrationEventLogContext ctx)
        {
            _context = ctx;
        }
        // GET: /home/
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(List<IntegrationEventLogEntry>), (int)HttpStatusCode.OK)]
        public IActionResult GetLogById(int id)
        {
            return Ok(_context.IntegrationEventLogs.Where(x => x.OrderId == id).ToList());
        }
    }
}