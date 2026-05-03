using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.inventoryContracts;

namespace Nimble_It.Api.Contracts.productsContracts
{
    public class ProductItemResponseContract
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; } = null!;

        public string UomName { get; set; } = null!;
        
        public string? ImageUrl { get; set; }

        public List<InventoryItemResponseContract> Inventory { get; set; } = [];
    }
}
