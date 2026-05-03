namespace Nimble_It.Api.Contracts.productsContracts;

// Vereenvoudigde product request: enkel IDs, geen nested objects (categoryId/uomId ipv hele objecten)
public class ProductRequestContract
{
    public string Name { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public int UomId { get; set; }
    public string? Image { get; set; }
}
