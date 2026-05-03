using Microsoft.AspNetCore.Http;

namespace Nimble_It.Api.Contracts.recipesContracts
{
    public class RecipeRequestContract
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public IFormFile? Image { get; set; }
        public List<int> Tags { get; set; } = new();
        public int ServingSize { get; set; }
        public int Complexity { get; set; }
        public int PrepareTime { get; set; }
        public List<RecipePartRequestContract> RecipeParts { get; set; } = new();
        public List<InstructionRequestContract> Instructions { get; set; } = new();
    }

    public class RecipePartRequestContract
    {
        public string Title { get; set; } = null!;
        public List<RecipeProductRequestContract> Products { get; set; } = new();
    }

    public class RecipeProductRequestContract
    {
        public int ProductId { get; set; }
        public double Amount { get; set; }
    }

    public class InstructionRequestContract
    {
        public string Step { get; set; } = null!;
        public string Header { get; set; } = null!;
        public string Text { get; set; } = null!;
    }
}
