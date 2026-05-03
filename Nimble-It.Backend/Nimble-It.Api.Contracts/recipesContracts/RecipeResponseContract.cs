namespace Nimble_It.Api.Contracts.recipesContracts
{
    public class RecipeResponseContract
    {
        public int RecipeId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Image { get; set; }
        public bool? Cookable { get; set; }
    }
}
