using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.Controllers
{
    public class HomeController : Controller
    {
        // GET: /home/
        public IActionResult Index()
        {
            return new RedirectResult("~/swagger");
        }
    }
}