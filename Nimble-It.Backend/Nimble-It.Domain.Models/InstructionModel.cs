using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nimble_It.Domain.Models
{
    public class InstructionModel
    {
        public int Id { get; set; }

        public int Step { get; set; }

        public string Header { get; set; } = null!;

        public string Text { get; set; } = null!;

        public int? RecipeId { get; set; }
    }
}
