using System;
using System.Collections.Generic;

namespace Nimble_It.Persistence.Entities;

public partial class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int? NotificationTime { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
