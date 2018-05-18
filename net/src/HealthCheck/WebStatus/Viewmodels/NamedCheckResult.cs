using Enterprise.Extensions.HealthChecks;

namespace WebStatus.Viewmodels
{
    public class NamedCheckResult
    {
        public NamedCheckResult(string name, IHealthCheckResult result)
        {
            Name = name;
            Result = result;
        }

        public string Name { get; }

        public IHealthCheckResult Result { get; }
    }
}