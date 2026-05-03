using System;
using System.Collections.Generic;

namespace Nimble_It.Persistence.Entities;

public partial class Recipe
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int? PrepareTime { get; set; }

    public int? Complexity { get; set; }

    public int? ServingSize { get; set; }

    public string? ImageUrl { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? LastCooked { get; set; }

    public bool Favorite { get; set; }

    public virtual ICollection<Instruction> Instructions { get; set; } = new List<Instruction>();

    public virtual ICollection<RecipeInfo> RecipeInfos { get; set; } = new List<RecipeInfo>();

    public virtual ICollection<RecipeTag> RecipeTags { get; set; } = new List<RecipeTag>();
}
