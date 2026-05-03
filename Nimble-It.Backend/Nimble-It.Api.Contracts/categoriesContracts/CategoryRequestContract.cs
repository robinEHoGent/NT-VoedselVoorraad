namespace Nimble_It.Api.Contracts.categoriesContracts;

public class CategoryRequestContract
{
    public required string CategoryName { get; set; }
    public int? NotificationTime { get; set; }
}
