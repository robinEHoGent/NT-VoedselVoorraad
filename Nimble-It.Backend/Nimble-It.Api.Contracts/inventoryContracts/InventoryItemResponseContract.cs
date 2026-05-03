using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nimble_It.Api.Contracts.inventoryContracts
{
    public class InventoryItemResponseContract
    {
        public int InventoryId { get; set; }
        //uitbreiding voor de 6 req body scenario's
        public int ProductId { get; set; }

        public string ProductName { get; set; } = null!;

        public string CategoryName { get; set; } = null!;

        public decimal? Amount { get; set; }

        public string UnitOfMeasurement { get; set; } = null!;

        public string StorageTypeName { get; set; } = null!;

        public DateOnly? PurchaseDate { get; set; }

        public DateOnly? ExpiryDate { get; set; }

        public string? ImageUrl { get; set; }
    }
}
