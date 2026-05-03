using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nimble_It.Api.Contracts.productsContracts
{
    public class ProductResponseContract
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; } = null!;

        public string UomName { get; set; } = null!;

        public string? ImageUrl { get; set; } // task 216
    }
}
