using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Moq;
using Nimble_It.Api.Contracts.storageTypeContracts;
using Nimble_It.Domain.Services;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;
using Xunit;

namespace Nimble_It.UnitTests
{
    public class InventoryServiceTests
    {
        [Fact]
        public async Task GetAllInventoryItems_WhenInventoryExists_ReturnsGroupedData()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            var fakeInventory = new List<Inventory>
            {
                new Inventory
                {
                    Id = 1,
                    Amount = 10,
                    ExpiryDate = DateOnly.FromDateTime(DateTime.Now.AddDays(30)),
                    PurchaseDate = DateOnly.FromDateTime(DateTime.Now),
                    StorageType = new StorageType { Id = 1, Name = "Fridge" },
                    Product = new Product
                    {
                        Id = 1,
                        Name = "Milk",
                        Uom = new UnitsOfMeasurement { Id = 1, Name = "Liters" },
                        Category = new Category
                        {
                            Id = 1,
                            Name = "Dairy",
                            NotificationTime = 7,
                        },
                    },
                },
            };

            mockInventoryRepository.Setup(repo => repo.GetAllInventoryItems()).ReturnsAsync(fakeInventory);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.GetAllInventoryItems();
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.Single(result.Categories);
            Assert.Equal("Dairy", result.Categories[0].CategoryName);
            Assert.Single(result.Categories[0].Products);
            Assert.Equal("Milk", result.Categories[0].Products[0].ProductName);
            #endregion
        }

        [Fact]
        public async Task GetAllInventoryItems_WhenInventoryIsEmpty_ReturnsEmptyCategories()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            var fakeInventory = new List<Inventory>();

            mockInventoryRepository.Setup(repo => repo.GetAllInventoryItems()).ReturnsAsync(fakeInventory);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.GetAllInventoryItems();
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.Empty(result.Categories);
            #endregion
        }

        [Fact]
        public async Task GetAllInventoryItems_WhenProductIsNull_SkipsInvalidData()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            var fakeInventory = new List<Inventory>
            {
                new Inventory
                {
                    Id = 1,
                    Amount = 10,
                    ExpiryDate = DateOnly.FromDateTime(DateTime.Now.AddDays(30)),
                    PurchaseDate = DateOnly.FromDateTime(DateTime.Now),
                    StorageType = new StorageType { Id = 1, Name = "Fridge" },
                    Product = new Product
                    {
                        Id = 1,
                        Name = "Milk",
                        Uom = new UnitsOfMeasurement { Id = 1, Name = "Liters" },
                        Category = new Category
                        {
                            Id = 1,
                            Name = "Dairy",
                            NotificationTime = 7,
                        },
                    },
                },
                new Inventory
                {
                    Id = 2,
                    Amount = 5,
                    ExpiryDate = DateOnly.FromDateTime(DateTime.Now.AddDays(15)),
                    PurchaseDate = DateOnly.FromDateTime(DateTime.Now),
                    StorageType = null,
                    Product = new Product
                    {
                        Id = 2,
                        Name = "Cheese",
                        Uom = new UnitsOfMeasurement { Id = 1, Name = "Kg" },
                        Category = new Category
                        {
                            Id = 1,
                            Name = "Dairy",
                            NotificationTime = 7,
                        },
                    },
                },
            };

            mockInventoryRepository.Setup(repo => repo.GetAllInventoryItems()).ReturnsAsync(fakeInventory);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.GetAllInventoryItems();
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.Single(result.Categories);
            Assert.Single(result.Categories[0].Products);
            Assert.Equal("Milk", result.Categories[0].Products[0].ProductName);
            #endregion
        }

        [Theory]
        [InlineData("Vegetables", "Dairy", "Dairy")]
        [InlineData("Dairy", "Vegetables", "Dairy")]
        [InlineData("Meat", "Bakery", "Bakery")]
        public async Task GetAllInventoryItems_WithMultipleCategories_SortsAlphabetically(
            string category1,
            string category2,
            string expectedFirst
        )
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            var fakeInventory = new List<Inventory>
            {
                new Inventory
                {
                    Id = 1,
                    Amount = 10,
                    ExpiryDate = DateOnly.FromDateTime(DateTime.Now.AddDays(30)),
                    PurchaseDate = DateOnly.FromDateTime(DateTime.Now),
                    StorageType = new StorageType { Id = 1, Name = "Fridge" },
                    Product = new Product
                    {
                        Id = 1,
                        Name = "Item1",
                        Uom = new UnitsOfMeasurement { Id = 1, Name = "Units" },
                        Category = new Category
                        {
                            Id = 1,
                            Name = category1,
                            NotificationTime = 7,
                        },
                    },
                },
                new Inventory
                {
                    Id = 2,
                    Amount = 5,
                    ExpiryDate = DateOnly.FromDateTime(DateTime.Now.AddDays(15)),
                    PurchaseDate = DateOnly.FromDateTime(DateTime.Now),
                    StorageType = new StorageType { Id = 1, Name = "Fridge" },
                    Product = new Product
                    {
                        Id = 2,
                        Name = "Item2",
                        Uom = new UnitsOfMeasurement { Id = 1, Name = "Units" },
                        Category = new Category
                        {
                            Id = 2,
                            Name = category2,
                            NotificationTime = 7,
                        },
                    },
                },
            };

            mockInventoryRepository.Setup(repo => repo.GetAllInventoryItems()).ReturnsAsync(fakeInventory);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.GetAllInventoryItems();
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Categories.Count);
            Assert.Equal(expectedFirst, result.Categories[0].CategoryName);
            #endregion
        }

        
        [Fact]
        public async Task DeleteInventoryItem_WhenInventoryItemExists_ReturnsVoid()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            var fakeInventory = new List<Inventory>
            {
                new()
                {
                    Id = 1,
                    Amount = 10,
                    ExpiryDate = DateOnly.FromDateTime(DateTime.Now.AddDays(30)),
                    PurchaseDate = DateOnly.FromDateTime(DateTime.Now),
                    StorageType = new StorageType { Id = 1, Name = "Fridge" },
                    Product = new Product
                    {
                        Id = 1,
                        Name = "Milk",
                        Uom = new UnitsOfMeasurement { Id = 1, Name = "Liters" },
                        Category = new Category
                        {
                            Id = 1,
                            Name = "Dairy",
                            NotificationTime = 7,
                        },
                    },
                },
                new()
                {
                    Id = 2,
                    Amount = 5,
                    ExpiryDate = DateOnly.FromDateTime(DateTime.Now.AddDays(30)),
                    PurchaseDate = DateOnly.FromDateTime(DateTime.Now),
                    StorageType = new StorageType { Id = 1, Name = "Fridge" },
                    Product = new Product
                    {
                        Id = 1,
                        Name = "Milk",
                        Uom = new UnitsOfMeasurement { Id = 1, Name = "Liters" },
                        Category = new Category
                        {
                            Id = 1,
                            Name = "Dairy",
                            NotificationTime = 7,
                        },
                    },
                },
            };
            mockInventoryRepository
                .Setup(repo => repo.DeleteInventoryItem(1))
                .Callback<int>(id =>
                {
                    var product = fakeInventory.FirstOrDefault(i => i.Id == id);
                    if (product != null)
                        fakeInventory.Remove(product);
                })
                .Returns(Task.CompletedTask);
            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var response = await service.DeleteInventoryItem(1);
            #endregion

            #region Assert
            Assert.True(response);
            Assert.DoesNotContain(fakeInventory, i => i.Id == 1);
            Assert.Contains(fakeInventory, i => i.Id == 2);
            #endregion
        }
        
        [Fact]
        public async Task GetInventoryItemById_WhenCorrect_ReturnsContract()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            var entity = new Inventory
            {
                Id = 10,
                StorageType = new StorageType
                {
                    Name = "Fridge"
                }
            };

            mockInventoryRepository.Setup(r => r.GetById(10)).ReturnsAsync(entity);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.GetById(10);
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.Equal(10, result.InventoryId);
            Assert.Equal("Fridge", result.StorageTypeName);
            #endregion
        }

        [Fact]
        public async Task GetInventoryItemById_WhenEntityDoesNotExist_ReturnsNull()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            mockInventoryRepository.Setup(r => r.GetById(It.IsAny<int>())).ReturnsAsync((Inventory?)null);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.GetById(50);
            #endregion

            #region  Assert
            Assert.Null(result);
            #endregion
        }

        [Fact]
        public async Task GetInventoryItemById_WhenEntityHasNoStorageType_ReturnsNull()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            var entity = new Inventory
            {
                Id = 10,
                StorageType = null
            };

            mockInventoryRepository.Setup(r => r.GetById(10)).ReturnsAsync(entity);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.GetById(10);
            #endregion

            #region Assert
            Assert.Null(result);
            #endregion
        }

        [Fact]
        public async Task GetInventoryItemById_WhenStorageTypeNameIsNull_ReturnsNull()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            var entity = new Inventory
            {
                Id = 10,
                StorageType = new StorageType
                {
                    Name = null
                }
            };

            mockInventoryRepository.Setup(r => r.GetById(10)).ReturnsAsync(entity);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

             #region Act
            var result = await service.GetById(20);
            #endregion

            #region Assert
            Assert.Null(result);
            #endregion
        }

        [Fact]
        public async Task UpdateStorageTypeInventory_WhenInventoryDoesNotExist_ReturnsNull()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            mockInventoryRepository.Setup(r => r.GetById(5)).ReturnsAsync((Inventory?)null);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.UpdateStorageTypeInventory(5, "Desk");
            #endregion

            #region Assert
            Assert.Null(result);
            mockInventoryRepository.Verify(r => r.UpdateStorageTypeInventory(It.IsAny<Inventory>()), Times.Never);
            #endregion
        }

        [Fact]
        public async Task UpdateStorageTypeInventory_WhenCorrect_UpdatesStorageType()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            var request = new StorageTypeRequestContract
            {
                StorageTypeName = "Fridge"
            };

            var existing = new Inventory
            {
                Id = 1,
                StorageTypeId = 2,
                StorageType = new StorageType { Name = "Fridge" }
            };

            var updated = new Inventory
            {
                Id = 1,
                StorageType = new StorageType { Name = "Bag" }
            };

            mockInventoryRepository.Setup(r => r.GetById(1)).ReturnsAsync(existing);

            mockInventoryRepository.Setup(r => r.UpdateStorageTypeInventory(It.IsAny<Inventory>())).ReturnsAsync(updated);
            
            mockStorageRepository
                .Setup(r => r.GetStorageTypeIdByName(request.StorageTypeName))
                .ReturnsAsync(2);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.UpdateStorageTypeInventory(1, request.StorageTypeName);
            #endregion

            #region Assert
            Assert.NotNull(result);
            mockInventoryRepository.Verify(r => r.UpdateStorageTypeInventory(
                It.Is<Inventory>(inv => inv.StorageType.Name == request.StorageTypeName)), Times.Once);
            #endregion
        }

        [Fact]
        public async Task UpdateStorageTypeInventory_WhenRepoReturnsNull_ReturnsNull()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            var existing = new Inventory { 
                Id = 1,
                StorageType = null
            };

            mockInventoryRepository.Setup(r => r.GetById(1)).ReturnsAsync(existing);

            mockInventoryRepository.Setup(r => r.UpdateStorageTypeInventory(existing)).ReturnsAsync((Inventory?)null!);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.UpdateStorageTypeInventory(1, "Desk");
            #endregion

            #region Assert
            Assert.Null(result);
            #endregion
        }

        [Fact]
        public async Task UpdateAmountInventory_WhenUsing2Of5_UpdatesCorrectly()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            int inventoryId = 1;
            decimal currentAmount = 5;
            decimal usedAmount = 2;

            var existing = new Inventory { 
                Id = inventoryId, 
                Amount = currentAmount - usedAmount,
                StorageType = new StorageType { Name = "Fridge" }
            };

            mockInventoryRepository
                .Setup(r => r.UpdateAmountInventory(inventoryId, usedAmount))
                .ReturnsAsync(existing);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.UpdateAmountInventory(inventoryId, usedAmount);
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.Equal(existing.Id, result.InventoryId);
            Assert.Equal(existing.Amount, result.Amount);
            #endregion
        }

        [Fact]
        public async Task UpdateAmountInventory_WhenUsing6Of5_ReturnsNull()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            int inventoryId = 1;
            decimal usedAmount = 6;

            mockInventoryRepository
                .Setup(r => r.UpdateAmountInventory(inventoryId, usedAmount))
                .ReturnsAsync((Inventory) null);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.UpdateAmountInventory(inventoryId, usedAmount);
            #endregion

            #region Assert
            Assert.Null(result);
            #endregion
        }

        [Fact]
        public async Task UpdateAmountInventory_WhenUsingFully_ReturnsEmptyContract()
        {
            #region Arrange
            var mockInventoryRepository = new Mock<IInventoryRepository>();
            var mockStorageRepository = new Mock<IStorageTypeRepository>();

            int inventoryId = 1;
            decimal usedAmount = 5;
            var entity = new Inventory { Id = 0 }; 

            mockInventoryRepository
                .Setup(r => r.UpdateAmountInventory(inventoryId, usedAmount))
                .ReturnsAsync(entity);

            var service = new InventoryService(mockInventoryRepository.Object, mockStorageRepository.Object);
            #endregion

            #region Act
            var result = await service.UpdateAmountInventory(inventoryId, usedAmount);
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.Equal(0, result.InventoryId);
            #endregion
        }
    }
}