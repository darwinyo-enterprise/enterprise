using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Models
{
    public class ApplicationUserClaim:IdentityUserClaim<string>
    {
    }
}
