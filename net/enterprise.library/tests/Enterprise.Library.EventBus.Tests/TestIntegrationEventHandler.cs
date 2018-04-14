using System.Threading.Tasks;
using Enterprise.Library.EventBus.Abstractions;

namespace Enterprise.Library.EventBus.Tests
{
    public class TestIntegrationEventHandler : IIntegrationEventHandler<TestIntegrationEvent>
    {
        public TestIntegrationEventHandler()
        {
            Handled = false;
        }

        public bool Handled { get; private set; }

        public async Task Handle(TestIntegrationEvent @event)
        {
            await Task.Factory.StartNew(() => { Handled = true; });
        }
    }
}