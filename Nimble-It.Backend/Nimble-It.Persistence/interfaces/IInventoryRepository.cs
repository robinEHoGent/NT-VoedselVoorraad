using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Persistence.interfaces
{
    public interface IInventoryRepository
    {
        Task<List<Inventory>> GetAllInventoryItems();
        Task<Inventory?> GetById(int inventoryId);
        Task<Inventory?> UpdateStorageTypeInventory(Inventory inventoryItem);
        Task DeleteInventoryItem(int inventoryid);
        Task<Inventory> AddInventoryItem(Inventory inventory);
        Task<Inventory?> UpdateAmountInventory(int inventoryId, decimal amount);
    }
}
