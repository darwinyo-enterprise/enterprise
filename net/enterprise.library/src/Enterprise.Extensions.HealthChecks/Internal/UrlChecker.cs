using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Enterprise.Extensions.HealthChecks.Internal
{
    public class UrlChecker
    {
        /// <summary>
        ///     Function For Check Health
        /// </summary>
        private readonly Func<HttpResponseMessage, ValueTask<IHealthCheckResult>> _checkFunc;

        private readonly string _url;

        public UrlChecker(Func<HttpResponseMessage, ValueTask<IHealthCheckResult>> checkFunc, string url)
        {
            Guard.ArgumentNotNull(nameof(checkFunc), checkFunc);
            Guard.ArgumentNotNullOrEmpty(nameof(url), url);

            _checkFunc = checkFunc;
            _url = url;
        }

        public CheckStatus PartiallyHealthyStatus { get; set; } = CheckStatus.Warning;

        /// <summary>
        ///     Check Service Health Function
        /// </summary>
        /// <returns>
        ///     Health Service Info
        /// </returns>
        public async Task<IHealthCheckResult> CheckAsync()
        {
            using (var httpClient = CreateHttpClient())
            {
                try
                {
                    var response = await httpClient.GetAsync(_url).ConfigureAwait(false);
                    return await _checkFunc(response);
                }
                catch (Exception ex)
                {
                    var data = new Dictionary<string, object> {{"url", _url}};
                    return HealthCheckResult.Unhealthy($"Exception during check: {ex.GetType().FullName}", data);
                }
            }
        }

        /// <summary>
        ///     Create Http Client Object
        /// </summary>
        /// <returns>HttpClient Object</returns>
        private HttpClient CreateHttpClient()
        {
            var httpClient = GetHttpClient();
            httpClient.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue {NoCache = true};
            return httpClient;
        }

        /// <summary>
        ///     Check Service Health By HttpResponse
        /// </summary>
        /// <param name="response">
        ///     Check Service Health Response
        /// </param>
        /// <returns>
        ///     Services Health Info
        /// </returns>
        public static async ValueTask<IHealthCheckResult> DefaultUrlCheck(HttpResponseMessage response)
        {
            var status = response.IsSuccessStatusCode ? CheckStatus.Healthy : CheckStatus.Unhealthy;
            var data = new Dictionary<string, object>
            {
                {"url", response.RequestMessage.RequestUri.ToString()},
                {"status", (int) response.StatusCode},
                {"reason", response.ReasonPhrase},
                // ReSharper disable once PossibleNullReferenceException
                {"body", await response.Content?.ReadAsStringAsync()}
            };
            return HealthCheckResult.FromStatus(status,
                $"status code {response.StatusCode} ({(int) response.StatusCode})", data);
        }

        protected virtual HttpClient GetHttpClient()
        {
            return new HttpClient();
        }
    }
}