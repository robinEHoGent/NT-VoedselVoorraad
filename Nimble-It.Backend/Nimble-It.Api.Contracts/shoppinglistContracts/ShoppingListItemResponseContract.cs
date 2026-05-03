namespace Nimble_It.Api.Contracts.shoppinglistContracts
{
    public class ShoppingListItemResponseContract
    {
        public int Id { get; set; }
        public ShoppingListItemProductResponseContract Product { get; set; }
        public decimal? Amount { get; set; }
    }   
}
