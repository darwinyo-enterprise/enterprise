using System;
using MediatR;

namespace Order.API.Application.Commands
{
    public class IdentifiedCommand<T, TR> : IRequest<TR>
        where T : IRequest<TR>
    {
        public IdentifiedCommand(T command, Guid id)
        {
            Command = command;
            Id = id;
        }

        public T Command { get; }
        public Guid Id { get; }
    }
}