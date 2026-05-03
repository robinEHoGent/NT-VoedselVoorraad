using System;
using System.Collections.Generic;

namespace Nimble_It.Persistence.Entities;

public partial class Inventory
{
    public int Id { get; set; }

    public int? ProductId { get; set; }

    public decimal? Amount { get; set; }

    public DateOnly? PurchaseDate { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    public int? StorageTypeId { get; set; }

    public virtual Product? Product { get; set; }

    public virtual StorageType? StorageType { get; set; }
}
