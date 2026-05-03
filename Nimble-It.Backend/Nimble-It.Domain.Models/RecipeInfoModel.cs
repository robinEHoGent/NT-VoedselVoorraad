using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Domain.Models
{
    public class RecipeInfoModel
    {
        public int Id { get; set; }

        public int? RecipeId { get; set; }

        public int? ProductId { get; set; }

        public decimal? Amount { get; set; }

        public int? Part { get; set; }

        public string? Title { get; set; }

        public virtual ProductModel? Product { get; set; }

        public virtual Recipe? Recipe { get; set; }
    }
}
