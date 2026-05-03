using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.categoriesContracts;

namespace Nimble_It.Api.Contracts.inventoryContracts
{
    public class InventoryDataResponseContract
    {
        public List<CategoryItemResponseContract> Categories { get; set; } = [];
    }
}
