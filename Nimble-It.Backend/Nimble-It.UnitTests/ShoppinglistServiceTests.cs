using Microsoft.CodeAnalysis;
using Moq;
using Nimble_It.Api.Contracts.shoppinglistContracts;
using Nimble_It.Domain.Services;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.UnitTests {
    public class ShoppinglistServiceTests {
        [Fact]
        public async Task GetAllShoppinglistitems_WhenNoDataInRepo_ReturnsEmptyList() {
            #region Arrange
            var mockShoppinglistRepo = new Mock<IShoppingListRepository>();
            var shoppingListEntities = new List<ShoppingList>();

            mockShoppinglistRepo.Setup(repo => repo.GetAllShoppingListItems()).ReturnsAsync(shoppingListEntities);

            var service = new ShoppingListService(mockShoppinglistRepo.Object);
            #endregion

            #region Act
            var result = await service.GetShoppingListItems();
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.NotNull(result.ShoppingListItems);
            Assert.Empty(result.ShoppingListItems);
            #endregion
        }

        [Fact]
        public async Task GetAllShoppinglistitems_WhenDataInRepo_ReturnsListShoppinglistitems() {
            #region Arrange
            var mockShoppinglistRepo = new Mock<IShoppingListRepository>();


            var product1 = new Product
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
            };
            var product2 = new Product
            {
                Id = 2,
                Name = "Chocolate",
                Uom = new UnitsOfMeasurement { Id = 2, Name = "grams" },
                Category = new Category
                {
                    Id = 2,
                    Name = "Candy",
                    NotificationTime = 90,
                },
            };
            
            var shoppingListEntities = new List<ShoppingList>
            {
                new ShoppingList { Id = 1, ProductId = product1.Id, Amount = 2, Product = product1},
                new ShoppingList { Id = 2, ProductId = product2.Id, Amount = 4, Product = product2}
            };

            mockShoppinglistRepo.Setup(repo => repo.GetAllShoppingListItems()).ReturnsAsync(shoppingListEntities);

            var service = new ShoppingListService(mockShoppinglistRepo.Object);
            #endregion

            #region Act
            var result = await service.GetShoppingListItems();
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.ShoppingListItems.Count);
            Assert.Contains(result.ShoppingListItems, sl => sl.Product.ProductId == 1 && sl.Amount == 2 && sl.Id == 1);
            Assert.Contains(result.ShoppingListItems, sl => sl.Product.ProductId == 2 && sl.Amount == 4 && sl.Id == 2);
            #endregion
        }

        [Fact]
        public async Task CreateShoppinglistitem_WhenProductExist_ReturnsShoppinglistitem() {
            #region Arrange
            var mockShoppinglistRepo = new Mock<IShoppingListRepository>();

            var productEntity = new Product
            {
                Id = 1,
                Name = "Water",
                Uom = new UnitsOfMeasurement { Id = 1, Name = "Liters" },
                Category = new Category
                {
                    Id = 1,
                    Name = "Drink",
                    NotificationTime = 7,
                },
            };

            var newShoppinglistitemRequestContract = new ShoppingListItemRequestContract { ProductId = productEntity.Id, Amount = 6 };
            //var newShoppinglist = newShoppinglistitemRequestContract.ToModel().ToEntity();
            var newShoppinglist = new ShoppingList
            {
                Id = 1,
                ProductId = newShoppinglistitemRequestContract.ProductId,
                Amount = newShoppinglistitemRequestContract.Amount,
                Product = productEntity
            };

            mockShoppinglistRepo.Setup(r => r.CreateShoppingListItem(It.IsAny<ShoppingList>())).ReturnsAsync(newShoppinglist);

            var service = new ShoppingListService(mockShoppinglistRepo.Object);

            #endregion

            #region Act
            var result = await service.CreateShoppingListItem(newShoppinglistitemRequestContract);
            #endregion

            #region Assert
            Assert.NotNull(result);
            mockShoppinglistRepo.Verify(sr => sr.CreateShoppingListItem(
                It.Is<ShoppingList>(sl => sl.ProductId == 1 && sl.Amount == 6)), Times.Once);
            #endregion
        }

        [Fact]
        public async Task UpdateShoppinglistitem_WhenShoppinglistitemExist_ReturnsShoppinglistitem() {
            #region Arrange
            var mockShoppinglistRepo = new Mock<IShoppingListRepository>();

            var product1 = new Product
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
            };
            var product2 = new Product
            {
                Id = 2,
                Name = "Chocolate",
                Uom = new UnitsOfMeasurement { Id = 2, Name = "grams" },
                Category = new Category
                {
                    Id = 2,
                    Name = "Candy",
                    NotificationTime = 90,
                },
            };
            var shoppingListEntities = new List<ShoppingList>
            {
                new ShoppingList { Id = 1, ProductId = product1.Id, Amount = 2, Product = product1},
                new ShoppingList { Id = 2, ProductId = product2.Id, Amount = 4, Product = product2},
            };

            var shoppinglistitemBeforeUpdate = shoppingListEntities[0];

            var shoppinglistitemRequestContract = new ShoppingListItemRequestContract()
            {
                Amount = 10,
                ProductId = (int)shoppinglistitemBeforeUpdate.ProductId
            };

            var shoppinglistitemAfterUpdate = new ShoppingList
            { 
                ProductId = shoppinglistitemRequestContract.ProductId, 
                Amount = shoppinglistitemRequestContract.Amount,
                Product = shoppinglistitemBeforeUpdate.Product
            };


            mockShoppinglistRepo.Setup(r => r.GetShoppingListItem(shoppinglistitemBeforeUpdate.Id)).ReturnsAsync(shoppinglistitemBeforeUpdate);

            mockShoppinglistRepo.Setup(r => r.UpdateShoppingListItem(It.IsAny<ShoppingList>())).ReturnsAsync(shoppinglistitemAfterUpdate);


            var service = new ShoppingListService(mockShoppinglistRepo.Object);
            #endregion

            #region Act
            var result = await service.UpdateShoppinglistItem(shoppinglistitemRequestContract, 1);
            #endregion

            #region Assert
            Assert.NotNull(result);
            mockShoppinglistRepo.Verify(sr => sr.UpdateShoppingListItem(
                It.Is<ShoppingList>(sl => sl.ProductId == 1 && sl.Amount == 10)), Times.Once);
            #endregion
        }

        [Fact]
        public async Task DeleteShoppinglistitem_ReturnsTrue() {
            #region Arrange
            var mockShoppinglistRepo = new Mock<IShoppingListRepository>();
            var shoppingListEntities = new List<ShoppingList>
            {
                new ShoppingList { Id = 1, ProductId = 1, Amount = 2, Product = null},
                new ShoppingList { Id = 2, ProductId = 2, Amount = 4, Product = null},
                new ShoppingList { Id = 3, ProductId = 3, Amount = 6, Product = null},
                new ShoppingList { Id = 4, ProductId = 4, Amount = 8, Product = null}
            };

            mockShoppinglistRepo
                .Setup(repo => repo.DeleteShoppingListItem(1))
                .Callback<int>(id =>
                {
                    var shoppinglistitem = shoppingListEntities.FirstOrDefault(i => i.Id == id);
                    if (shoppinglistitem != null)
                        shoppingListEntities.Remove(shoppinglistitem);
                })
                .Returns(Task<bool>.FromResult(true));

            var service = new ShoppingListService(mockShoppinglistRepo.Object);
            #endregion

            #region Act
            var response = await service.RemoveShoppingListItem(1);
            #endregion

            #region Assert
            Assert.True(response);
            Assert.DoesNotContain(shoppingListEntities, i => i.Id == 1);
            Assert.Contains(shoppingListEntities, i => i.Id == 2);
            #endregion

        }

    }
}
