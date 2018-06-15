using Microsoft.AspNetCore.Identity;

namespace Identity.API.Models
{
    public class ApplicationRole : IdentityRole
    {
        public ApplicationRole(string roleName) : base(roleName)
        {
        }

        public ApplicationRole()
        {
        }
    }
}