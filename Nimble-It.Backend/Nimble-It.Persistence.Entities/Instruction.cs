using System;
using System.Collections.Generic;

namespace Nimble_It.Persistence.Entities;

public partial class Instruction
{
    public int Id { get; set; }

    public int Step { get; set; }

    public string Header { get; set; } = null!;

    public string Text { get; set; } = null!;

    public int? RecipeId { get; set; }

    public virtual Recipe? Recipe { get; set; }
}
