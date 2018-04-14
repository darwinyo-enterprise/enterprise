namespace Enterprise.Library.CommandBus.Abstractions
{
    public interface ICommandBus
    {
        void Send<T>(string name, T data);
        void Handle<TC>(string name, IIntegrationCommandHandler<TC> handler);
        void Handle(string name, IIntegrationCommandHandler handler);
        void Handle<TI, TC>(TI handler)
            where TI : IIntegrationCommandHandler<TC>;
    }

}
