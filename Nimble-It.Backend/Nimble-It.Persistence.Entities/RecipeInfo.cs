using System;
using System.Collections.Generic;

namespace Nimble_It.Persistence.Entities;

public partial class RecipeInfo
{
    public int Id { get; set; }

    public int? RecipeId { get; set; }

    public int? ProductId { get; set; }

    public decimal Amount { get; set; }

    public string Title { get; set; } = null!;

    public int Part { get; set; }

    public int OrderIndex { get; set; }

    public virtual Product? Product { get; set; }

    public virtual Recipe? Recipe { get; set; }
}
