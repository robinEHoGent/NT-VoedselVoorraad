using System;
using System.Collections.Generic;

namespace Nimble_It.Persistence.Entities;

public partial class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int? CategoryId { get; set; }

    public int? UomId { get; set; }

    public string? ImageUrl { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();

    public virtual ICollection<RecipeInfo> RecipeInfos { get; set; } = new List<RecipeInfo>();

    public virtual ICollection<ShoppingList> ShoppingLists { get; set; } = new List<ShoppingList>();

    public virtual UnitsOfMeasurement? Uom { get; set; }
}
