using System;
using System.Data;
using System.Data.SqlClient;
using Enterprise.Extensions.HealthChecks.Checks;

namespace Enterprise.Extensions.HealthChecks.SqlServer
{
    // REVIEW: What are the appropriate guards for these functions?

    public static class HealthCheckBuilderSqlServerExtensions
    {
        public static HealthCheckBuilder AddSqlCheck(this HealthCheckBuilder builder, string name,
            string connectionString)
        {
            Guard.ArgumentNotNull(nameof(builder), builder);

            return AddSqlCheck(builder, name, connectionString, builder.DefaultCacheDuration);
        }

        public static HealthCheckBuilder AddSqlCheck(this HealthCheckBuilder builder, string name,
            string connectionString, TimeSpan cacheDuration)
        {
            builder.AddCheck($"SqlCheck({name})", async () =>
            {
                try
                {
                    //TODO: There is probably a much better way to do this.
                    using (var connection = new SqlConnection(connectionString))
                    {
                        connection.Open();
                        using (var command = connection.CreateCommand())
                        {
                            command.CommandType = CommandType.Text;
                            command.CommandText = "SELECT 1";
                            var result = (int) await command.ExecuteScalarAsync().ConfigureAwait(false);
                            if (result == 1) return HealthCheckResult.Healthy($"SqlCheck({name}): Healthy");

                            return HealthCheckResult.Unhealthy($"SqlCheck({name}): Unhealthy");
                        }
                    }
                }
                catch (Exception ex)
                {
                    return HealthCheckResult.Unhealthy(
                        $"SqlCheck({name}): Exception during check: {ex.GetType().FullName}");
                }
            }, cacheDuration);

            return builder;
        }
    }
}