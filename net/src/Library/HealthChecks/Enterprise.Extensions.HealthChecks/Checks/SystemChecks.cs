using System;
using System.Diagnostics;

namespace Enterprise.Extensions.HealthChecks.Checks
{
    public static partial class HealthCheckBuilderExtensions
    {
        // System checks

        public static HealthCheckBuilder AddPrivateMemorySizeCheck(this HealthCheckBuilder builder, long maxSize)
        {
            return AddMaxValueCheck(builder, $"PrivateMemorySize({maxSize})", maxSize,
                () => Process.GetCurrentProcess().PrivateMemorySize64);
        }

        public static HealthCheckBuilder AddPrivateMemorySizeCheck(this HealthCheckBuilder builder, long maxSize,
            TimeSpan cacheDuration)
        {
            return AddMaxValueCheck(builder, $"PrivateMemorySize({maxSize})", maxSize,
                () => Process.GetCurrentProcess().PrivateMemorySize64, cacheDuration);
        }

        public static HealthCheckBuilder AddVirtualMemorySizeCheck(this HealthCheckBuilder builder, long maxSize)
        {
            return AddMaxValueCheck(builder, $"VirtualMemorySize({maxSize})", maxSize,
                () => Process.GetCurrentProcess().VirtualMemorySize64);
        }

        public static HealthCheckBuilder AddVirtualMemorySizeCheck(this HealthCheckBuilder builder, long maxSize,
            TimeSpan cacheDuration)
        {
            return AddMaxValueCheck(builder, $"VirtualMemorySize({maxSize})", maxSize,
                () => Process.GetCurrentProcess().VirtualMemorySize64, cacheDuration);
        }

        public static HealthCheckBuilder AddWorkingSetCheck(this HealthCheckBuilder builder, long maxSize)
        {
            return AddMaxValueCheck(builder, $"WorkingSet({maxSize})", maxSize,
                () => Process.GetCurrentProcess().WorkingSet64);
        }

        public static HealthCheckBuilder AddWorkingSetCheck(this HealthCheckBuilder builder, long maxSize,
            TimeSpan cacheDuration)
        {
            return AddMaxValueCheck(builder, $"WorkingSet({maxSize})", maxSize,
                () => Process.GetCurrentProcess().WorkingSet64, cacheDuration);
        }
    }
}