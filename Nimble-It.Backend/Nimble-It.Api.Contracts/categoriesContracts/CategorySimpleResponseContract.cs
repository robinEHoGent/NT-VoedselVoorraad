namespace Nimble_It.Api.Contracts.categoriesContracts
{
    public class CategorySimpleResponseContract
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public int? NotificationTime { get; set; }
    }
}
