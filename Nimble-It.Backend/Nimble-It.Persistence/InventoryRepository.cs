using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Persistence
{
    public class InventoryRepository(NimbleitDbContext context) : IInventoryRepository
    {
        public async Task DeleteInventoryItem(int inventoryid)
        {
            var inventory =
                await context.Inventories.FirstOrDefaultAsync(i => i.Id == inventoryid)
                ?? throw new KeyNotFoundException("that instance does not exist");
            context.Inventories.Remove(inventory);
            await context.SaveChangesAsync();
        }

        public async Task<List<Inventory>> GetAllInventoryItems()
        {
            var inventoryEntities = await context
                .Inventories.Include(i => i.Product!)
                    .ThenInclude(p => p.Uom)
                .Include(i => i.Product!)
                    .ThenInclude(p => p.Category)
                .Include(i => i.Product!)
                .Include(i => i.StorageType)
                .ToListAsync();

            return inventoryEntities;
        }

        public async Task<Inventory?> GetById(int inventoryId)
        {
            // voorlopig enkel storage type meegeven
            return await context
                .Inventories.Include(i => i.Product)
                .Include(i => i.StorageType)
                .FirstOrDefaultAsync(i => i.Id == inventoryId);
        }

        public async Task<Inventory?> UpdateStorageTypeInventory(Inventory inventoryItem)
        {
            var existingInventoryEntity = await GetById(inventoryItem.Id);

            if (existingInventoryEntity is null)
                return null;

            existingInventoryEntity.StorageTypeId = inventoryItem.StorageTypeId;

            await context.SaveChangesAsync();

            // Haal correcte storage type name opnieuw op
            return await GetById(existingInventoryEntity.Id);
        }

        public async Task<Inventory> AddInventoryItem(Inventory inventory)
        {
            context.Inventories.Add(inventory);
            await context.SaveChangesAsync();

            // Reload with includes
            return await context
                .Inventories.Include(i => i.Product!)
                    .ThenInclude(p => p.Uom)
                .Include(i => i.Product!)
                    .ThenInclude(p => p.Category)
                .Include(i => i.StorageType)
                .FirstAsync(i => i.Id == inventory.Id);
        }

        public async Task<Inventory?> UpdateAmountInventory(int inventoryId, decimal amount)
        {
            var existingInventoryEntity = await GetById(inventoryId);
            if (existingInventoryEntity is null)
                return null;

            if (existingInventoryEntity.Amount < amount)
                throw new InvalidOperationException("Not enough of this product available to use.");

            if (existingInventoryEntity.Amount == amount)
            {
                await DeleteInventoryItem(inventoryId);
                return new Inventory();
            }

            existingInventoryEntity.Amount -= amount;

            await context.SaveChangesAsync();

            return existingInventoryEntity;
        }
    }
}
