using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.productsContracts;

namespace Nimble_It.Api.Contracts.recipesContracts
{
    public class RecipePartResponseContract
    {
        public int PartId { get; set; }
        public string Title { get; set; } = null!;
        public List<RecipeProductResponseContract> Products { get; set; } = null!;
    }
}
