namespace Catalog.API
{
    public class CatalogSettings
    {
        public string ManufacturerImageBaseUrl { get; set; }
        public string ProductImageBaseUrl { get; set; }
        public string CatalogImageBaseUrl { get; set; }
        public string EventBusConnection { get; set; }
        public bool UseCustomizationData { get; set; }
        public bool AzureStorageEnabled { get; set; }
    }
}