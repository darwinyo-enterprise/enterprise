using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

namespace Enterprise.Library.HealthChecks
{
    public class HealthCheckStartupFilter : IStartupFilter
    {
        private readonly string _path;
        private readonly TimeSpan _timeout;
        private readonly int? _port;

        public HealthCheckStartupFilter(int port, TimeSpan timeout)
        {
            _port = port;
            _timeout = timeout;
        }

        public HealthCheckStartupFilter(string path, TimeSpan timeout)
        {
            _path = path;
            _timeout = timeout;
        }

        public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
        {
            return app =>
            {
                if (_port.HasValue)
                    app.UseMiddleware<HealthCheckMiddleware>(_port, _timeout);
                else
                    app.UseMiddleware<HealthCheckMiddleware>(_path, _timeout);

                next(app);
            };
        }
    }
}