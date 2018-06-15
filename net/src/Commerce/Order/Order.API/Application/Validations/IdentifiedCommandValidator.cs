using FluentValidation;
using Order.API.Application.Commands;

namespace Order.API.Application.Validations
{
    public class IdentifiedCommandValidator : AbstractValidator<IdentifiedCommand<CreateOrderCommand, bool>>
    {
        public IdentifiedCommandValidator()
        {
            RuleFor(command => command.Id).NotEmpty();    
        }
    }
}
