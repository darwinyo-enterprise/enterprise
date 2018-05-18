using System.ComponentModel.DataAnnotations;

namespace Identity.API.Models.AccountViewModels
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required] [EmailAddress] public string Email { get; set; }
    }
}