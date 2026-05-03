using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.categoriesContracts;
using Nimble_It.Api.Contracts.inventoryContracts;
using Nimble_It.Api.Contracts.productsContracts;
using Nimble_It.Domain.Models;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Domain.Services.mappers
{
    public static class InventoryMapper
    {
        public static List<InventoryModel> ToModel(this List<Inventory> enteties)
        {
            return enteties.Select(ToModel).Where(model => model != null).ToList()!;
        }

        public static InventoryModel? ToModel(this Inventory entity)
        {
            if (entity.StorageType is null)
                return null;

            var productModel = ToModel(entity.Product);
            if (productModel is null)
                return null;

            return new InventoryModel
            {
                Id = entity.Id,
                Amount = entity.Amount,
                ExpiryDate = entity.ExpiryDate,
                PurchaseDate = entity.PurchaseDate,
                Product = productModel,
                StorageTypeName = entity.StorageType.Name,
            };
        }

        public static InventoryModel? ToModelNoProduct(this Inventory entity)
        {
            if (entity.StorageType is null)
                return null;

            return new InventoryModel
            {
                Id = entity.Id,
                // purchasedate, expirydate -> nog niet nodig
                Amount = entity.Amount,
                StorageTypeName = entity.StorageType.Name,
            };
        }

        public static ProductModel? ToModel(this Product? entity)
        {
            if (entity is null || entity.Uom is null)
                return null;

            return new ProductModel
            {
                Id = entity.Id,
                Name = entity.Name,
                UOMName = entity.Uom.Name,
                Category = entity.Category?.ToModel(),
                ImageUrl = entity.ImageUrl
            };
        }

        public static InventoryItemResponseContract? ToContract(this InventoryModel inventoryModel)
        {
            if (inventoryModel.StorageTypeName is null)
                return null;

            return new InventoryItemResponseContract
            {
                InventoryId = inventoryModel.Id,
                // purchasedate, expirydate -> nog niet nodig
                Amount = inventoryModel.Amount,
                StorageTypeName = inventoryModel.StorageTypeName,
            };
        }

        public static InventoryDataResponseContract ToGroupedContract(
            this List<InventoryModel> models
        )
        {
            var groupedCategories = models
                .GroupBy(i => i.Product?.Category?.Name)
                .OrderBy(categoryGroup => categoryGroup.Key)
                .Select(categoryGroup =>
                {
                    var categoryModel = categoryGroup.First().Product?.Category;
                    
                    if (categoryModel is null)
                        throw new InvalidOperationException(
                            "Inventory item has null category - this should have been filtered earlier"
                        );

                    var categoryDto = categoryModel.ToContract();

                    categoryDto.Products = categoryGroup
                        .GroupBy(i => i.Product?.Name)
                        .OrderBy(productGroup => productGroup.Key)
                        .Select(productGroup =>
                        {
                            var productModel = productGroup.First().Product;

                            if (productModel is null || productModel.UOMName is null)
                                throw new InvalidOperationException(
                                    "Inventory item has null product or UOM - this should have been filtered earlier"
                                );

                            var productDto = new ProductItemResponseContract
                            {
                                ProductId = productModel.Id,
                                ProductName = productModel.Name!,
                                UomName = productModel.UOMName!,
                                ImageUrl = productModel.ImageUrl,
                            };

                            productDto.Inventory = productGroup
                                .Select(i => new InventoryItemResponseContract
                                {
                                    InventoryId = i.Id,
                                    Amount = i.Amount,
                                    PurchaseDate = i.PurchaseDate,
                                    ExpiryDate = i.ExpiryDate,
                                    StorageTypeName = i.StorageTypeName,
                                })
                                .OrderBy(i => i.ExpiryDate)
                                .ToList();

                            return productDto;
                        })
                        .ToList();

                    return categoryDto;
                })
                .ToList();

            return new InventoryDataResponseContract { Categories = groupedCategories };
        }
    }
}
