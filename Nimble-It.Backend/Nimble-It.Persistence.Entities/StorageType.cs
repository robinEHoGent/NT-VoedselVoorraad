using System;
using System.Collections.Generic;

namespace Nimble_It.Persistence.Entities;

public partial class StorageType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
}
