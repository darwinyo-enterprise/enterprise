namespace Catalog.API.ViewModels
{
    /// <summary>
    ///     used for inventory management paginated view
    /// </summary>
    public class ItemInventoryViewModel : ItemViewModel
    {
        public int Stock { get; set; }
    }
}