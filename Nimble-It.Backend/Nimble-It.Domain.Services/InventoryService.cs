using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.categoriesContracts;
using Nimble_It.Api.Contracts.inventoryContracts;
using Nimble_It.Api.Contracts.productsContracts;
using Nimble_It.Domain.Services.interfaces;
using Nimble_It.Domain.Services.mappers;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Domain.Services
{
    // InventoryService gaat alle inventory zaken handlen incl nieuwe prod creatie
    // gebruikt hier enkel IInventoryRepository & IProductRepository = geen directe app/ui dependencies
    public class InventoryService(
        IInventoryRepository inventoryRepository,
        IStorageTypeRepository storageTypeRepository
    ) : IInventoryService
    {
        public async Task<bool> DeleteInventoryItem(int inventoryItemId)
        {
            try
            {
                await inventoryRepository.DeleteInventoryItem(inventoryItemId);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<InventoryDataResponseContract> GetAllInventoryItems()
        {
            var inventoryResult = await inventoryRepository.GetAllInventoryItems();
            var inventoryModel = inventoryResult.ToModel();
            var inventoryContract = inventoryModel.ToGroupedContract();
            return inventoryContract;
        }

        public async Task<InventoryItemResponseContract?> GetById(int inventoryId)
        {
            var inventoryEntity = await inventoryRepository.GetById(inventoryId);
            return inventoryEntity?.ToModelNoProduct()?.ToContract();
        }

        public async Task<InventoryItemResponseContract?> UpdateStorageTypeInventory(
            int inventoryId,
            string storageTypeName
        )
        {
            var existingInventoryEntity = await inventoryRepository.GetById(inventoryId);

            if (existingInventoryEntity is null)
                return null;

            if (existingInventoryEntity.StorageType?.Name == storageTypeName)
            {
                throw new ArgumentException("Storage type can not be the same as before");
            }

            var storageTypeId = await storageTypeRepository.GetStorageTypeIdByName(storageTypeName);
            if (storageTypeId == 0)
                return null;

            existingInventoryEntity.StorageTypeId = storageTypeId;

            var updatedInventoryEntity = await inventoryRepository.UpdateStorageTypeInventory(
                existingInventoryEntity
            );

            return updatedInventoryEntity?.ToModelNoProduct()?.ToContract();
        }

        public async Task<InventoryItemResponseContract> AddInventoryItem(
            AddInventoryItemRequestContract request
        )
        {
            if (request.ProductId <= 0)
                throw new ArgumentException("ProductId must be provided");

            var storageTypeId = await storageTypeRepository.GetStorageTypeIdByName(request.StorageTypeName);
            if (storageTypeId == 0)
                throw new ArgumentException("Storage type must be provided");

            if (request.Amount <= 0)
                throw new InvalidOperationException("Amount must be positive");

            var inventory = new Inventory
            {
                ProductId = request.ProductId,
                Amount = request.Amount,
                StorageTypeId = storageTypeId,
                ExpiryDate = request.ExpiryDate,
                PurchaseDate = request.PurchaseDate,
            };

            var createdInventory = await inventoryRepository.AddInventoryItem(inventory);

            return new InventoryItemResponseContract
            {
                InventoryId = createdInventory.Id,
                ProductId = createdInventory.ProductId ?? 0,
                ProductName = createdInventory.Product?.Name ?? "",
                CategoryName = createdInventory.Product?.Category?.Name ?? "",
                Amount = createdInventory.Amount ?? 0,
                UnitOfMeasurement = createdInventory.Product?.Uom?.Name ?? "",
                StorageTypeName = createdInventory.StorageType?.Name ?? "",
                PurchaseDate = createdInventory.PurchaseDate,
                ExpiryDate = createdInventory.ExpiryDate,
                ImageUrl = createdInventory.Product?.ImageUrl,
            };
        }

        public async Task<InventoryItemResponseContract?> UpdateAmountInventory(
            int inventoryId,
            decimal amount
        )
        {
            var updatedInventoryEntity = await inventoryRepository.UpdateAmountInventory(
                inventoryId,
                amount
            );

            if (updatedInventoryEntity is null)
                return null;

            // check if inventory item is deleted
            if (updatedInventoryEntity.Id == 0)
            {
                return new InventoryItemResponseContract();
            }

            return updatedInventoryEntity?.ToModelNoProduct()?.ToContract();
        }
    }
}
