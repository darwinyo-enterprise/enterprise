using System.Threading;
using System.Threading.Tasks;

namespace Enterprise.Extensions.HealthChecks
{
    public interface IHealthCheck
    {
        ValueTask<IHealthCheckResult> CheckAsync(CancellationToken cancellationToken = default(CancellationToken));
    }
}