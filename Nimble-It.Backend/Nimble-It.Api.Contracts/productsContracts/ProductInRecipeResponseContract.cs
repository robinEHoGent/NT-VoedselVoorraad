using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nimble_It.Api.Contracts.productsContracts
{
    public class ProductInRecipeResponseContract : ProductResponseContract
    {
        public decimal Amount { get; set; }
    }
}
