using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nimble_It.Domain.Models
{
    public class InventoryModel
    {
        public int Id { get; set; }

        public decimal? Amount { get; set; }

        public DateOnly? ExpiryDate { get; set; }

        public DateOnly? PurchaseDate { get; set; }

        public ProductModel? Product { get; set; }

        // decontructing because only 1 value
        public string StorageTypeName { get; set; } = null!;
    }
}
