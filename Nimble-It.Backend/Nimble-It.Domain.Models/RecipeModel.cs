using Nimble_It.Api.Contracts.recipesContracts;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Domain.Models
{
    public class RecipeModel
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public int? PrepareTime { get; set; }

        public int? Complexity { get; set; }

        public int? ServingSize { get; set; }

        public string? Image { get; set; }

        public DateTime CreatedOn { get; set; }

        public bool? Cookable { get; set; }

        public DateTime? LastCooked { get; set; }

        public bool Favorite { get; set; }

        public ICollection<RecipeInfoModel> RecipeInfos { get; set; } = new List<RecipeInfoModel>();

        public ICollection<TagModel> RecipeTags { get; set; } = new List<TagModel>();

        public ICollection<InstructionModel> Instructions { get; set; } =
            new List<InstructionModel>();

        // Properties for creation
        public List<int>? TagIds { get; set; }
        public List<RecipePartRequestContract>? RecipeParts { get; set; }
        public List<InstructionRequestContract>? InstructionRequests { get; set; }
    }
}
