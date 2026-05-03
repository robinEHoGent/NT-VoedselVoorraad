using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.productsContracts;

namespace Nimble_It.Api.Contracts.recipesContracts
{
    public class RecipeProductResponseContract : ProductResponseContract
    {
        public decimal Amount { get; set; }
    }
}
