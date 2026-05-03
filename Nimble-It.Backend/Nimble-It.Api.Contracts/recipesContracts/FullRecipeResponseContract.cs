using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.InstructionContracts;
using Nimble_It.Api.Contracts.TagContracts;

namespace Nimble_It.Api.Contracts.recipesContracts
{
    public class FullRecipeResponseContract
    {
        public int RecipeId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public List<TagResponseContract>? Tags { get; set; }
        public int? ServingSize { get; set; }
        public int? Complexity { get; set; }
        public int? PrepareTime { get; set; }
        public List<RecipePartResponseContract>? Parts { get; set; }
        public List<InstructionResponseContract>? Instructions { get; set; }
        public string? CreatedOn { get; set; }
        public string? LastCooked { get; set; }
        public bool? Favorite { get; set; }
    }
}
