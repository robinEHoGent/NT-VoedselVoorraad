using System;
using System.Collections.Generic;

namespace Nimble_It.Persistence.Entities;

public partial class ShoppingList
{
    public int Id { get; set; }

    public int? ProductId { get; set; }

    public decimal? Amount { get; set; }

    public virtual Product? Product { get; set; }
}
