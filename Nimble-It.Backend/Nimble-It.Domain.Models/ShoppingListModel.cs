namespace Nimble_It.Domain.Models
{
    public class ShoppingListModel
    {
        public int Id { get; set; }

        public ProductModel Product { get; set; } = null!;

        public decimal? Amount { get; set; }
    }
}
