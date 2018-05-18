using System.Collections.Generic;
using System.Linq;
using Enterprise.Extensions.HealthChecks;

namespace WebStatus.Viewmodels
{
    public class HealthStatusViewModel
    {
        private readonly Dictionary<string, IHealthCheckResult> _results;

        private HealthStatusViewModel()
        {
            _results = new Dictionary<string, IHealthCheckResult>();
        }

        public HealthStatusViewModel(CheckStatus overall) : this()
        {
            OverallStatus = overall;
        }

        public CheckStatus OverallStatus { get; }

        public IEnumerable<NamedCheckResult> Results =>
            _results.Select(kvp => new NamedCheckResult(kvp.Key, kvp.Value));

        public void AddResult(string name, IHealthCheckResult result)
        {
            _results.Add(name, result);
        }
    }
}