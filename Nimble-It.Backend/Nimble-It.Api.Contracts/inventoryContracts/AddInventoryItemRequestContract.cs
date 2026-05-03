namespace Nimble_It.Api.Contracts.inventoryContracts;

public class AddInventoryItemRequestContract
{
    public int ProductId { get; set; }
    public decimal Amount { get; set; }
    public DateOnly? PurchaseDate { get; set; }
    public DateOnly ExpiryDate { get; set; }
    public string StorageTypeName { get; set; } = null!;
}
