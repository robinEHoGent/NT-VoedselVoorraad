using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.inventoryContracts;
using Nimble_It.Domain.Models;

namespace Nimble_It.Domain.Services.interfaces
{
    public interface IInventoryService
    {
        Task<InventoryDataResponseContract> GetAllInventoryItems();
        Task<InventoryItemResponseContract?> GetById(int inventoryId);
        Task<InventoryItemResponseContract?> UpdateStorageTypeInventory(int inventoryId, string storageTypeName);
        Task<InventoryItemResponseContract?> UpdateAmountInventory(int inventoryId, decimal amount);
        Task<bool> DeleteInventoryItem(int inventoryItemId);
        Task<InventoryItemResponseContract> AddInventoryItem(AddInventoryItemRequestContract request);
    }
}
