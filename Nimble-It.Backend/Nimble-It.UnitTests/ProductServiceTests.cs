using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.CodeAnalysis;
using Moq;
using Nimble_It.Api.Contracts.productsContracts;
using Nimble_It.Domain.Services;
using Nimble_It.Domain.Services.exceptions;
using Nimble_It.Domain.Services.interfaces;
using Nimble_It.Persistence;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;
using Xunit;

namespace Nimble_It.UnitTests
{
    public class ProductServiceTests
    {
        [Fact]
        public async Task DeleteProduct_WhenProductExists()
        {
            #region arrange
            var mockRepository = new Mock<IProductRepository>();

            var fakeProducts = new List<Product>
            {
                new()
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
                new()
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
                },
            };

            mockRepository
                .Setup(r => r.DeleteProduct(1))
                .Callback<int>(id =>
                {
                    var product = fakeProducts.FirstOrDefault(p => p.Id == id);
                    if (product != null)
                        fakeProducts.Remove(product);
                })
                .Returns(Task.CompletedTask);

            var service = new ProductService(mockRepository.Object);
            #endregion

            #region Act
            var response = await service.DeleteProduct(1);
            #endregion

            #region Assert
            Assert.True(response);
            Assert.DoesNotContain(fakeProducts, p => p.Id == 1);
            Assert.Contains(fakeProducts, p => p.Id == 2);
            #endregion
        }

        [Fact]
        public async Task GetAllProducts_WhenProductsExist_returnsProducts()
        {
            #region arrange
            var mockRepository = new Mock<IProductRepository>();

            var fakeProducts = new List<Product>
            {
                new()
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
                new()
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
                },
            };
            mockRepository.Setup(repo => repo.GetAllProducts()).ReturnsAsync(fakeProducts);
            var service = new ProductService(mockRepository.Object);
            #endregion

            #region Act
            var products = await service.GetProducts();
            #endregion

            #region Assert
            Assert.NotNull(products);
            Assert.Equal("Milk", products[0].ProductName);
            Assert.Equal(2, products[1].ProductId);
            #endregion
        }

        //Task 226: 3 nieuwe testen toegevoegd + 1 voor blob 

        [Fact]
        //succesvol product creatie uittesten & verificatie of product de juiste naam/id/uom heeft
        public async Task CreateProduct_WithValidData_ReturnsCreatedProduct()
        {
            #region arrange
            var mockRepository = new Mock<IProductRepository>();

            var request = new ProductCreateRequestContract
            {
                ProductName = "Bread",
                CategoryId = 1,
                UomId = 1
            };

            var createdProductWithUom = new Product
            {
                Id = 3,
                Name = "Bread",
                CategoryId = 1,
                UomId = 1,
                Uom = new UnitsOfMeasurement { Id = 1, Name = "Pieces" }
            };

            mockRepository
                .Setup(repo => repo.CreateProduct(It.IsAny<Product>()))
                .ReturnsAsync(createdProductWithUom);

            var service = new ProductService(mockRepository.Object);
            #endregion

            #region Act
            var result = await service.CreateProduct(request);
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.Equal("Bread", result.ProductName);
            Assert.Equal(3, result.ProductId);
            Assert.Equal("Pieces", result.UomName);
            #endregion
        }

        [Fact]
        // validatie testen wanneer product naam = empty string + correcte exception message?
        public async Task CreateProduct_WithEmptyName_ThrowsInvalidProductException()
        {
            #region arrange
            var mockRepository = new Mock<IProductRepository>();

            var request = new ProductCreateRequestContract
            {
                ProductName = "",
                CategoryId = 1,
                UomId = 1
            };

            var service = new ProductService(mockRepository.Object);
            #endregion

            #region Act & Assert
            var exception = await Assert.ThrowsAsync<InvalidProductException>(() =>
                service.CreateProduct(request));

            Assert.Equal("Product name cannot be empty", exception.Message);
            #endregion
        }

        [Fact]
        //validatie testen wanneer productnaam=null + correcte exception message
        public async Task CreateProduct_WithNullName_ThrowsInvalidProductException()
        {
            #region arrange
            var mockRepository = new Mock<IProductRepository>();

            var request = new ProductCreateRequestContract
            {
                ProductName = null!,
                CategoryId = 1,
                UomId = 1
            };

            var service = new ProductService(mockRepository.Object);
            #endregion

            #region Act & Assert
            var exception = await Assert.ThrowsAsync<InvalidProductException>(() =>
                service.CreateProduct(request));

            Assert.Equal("Product name cannot be empty", exception.Message);
            #endregion
        }

        [Fact]
        // task 216: testen van URL image storage - worden URLs correct opgeslagen?
        public async Task CreateProduct_WithImageUrl_SavesImageUrl()
        {
            #region arrange
            var mockRepository = new Mock<IProductRepository>();

            var imageUrl = "https://storageaccount.blob.core.windows.net/products/5649b6d1-7cfa-40dd-8568-725f964e637d.jpg";

            // Mock repository blob method to return Azure URL
            mockRepository
                .Setup(r => r.SaveProductImageAsync(It.IsAny<IFormFile>()))
                .ReturnsAsync(imageUrl);

            var request = new ProductCreateRequestContract
            {
                ProductName = "Banana",
                CategoryId = 1,
                UomId = 1,
                ImageFile = Mock.Of<IFormFile>() // Mock file
            };

            var createdProductWithImage = new Product
            {
                Id = 4,
                Name = "Banana",
                CategoryId = 1,
                UomId = 1,
                ImageUrl = imageUrl, // URL opgeslagen
                Uom = new UnitsOfMeasurement { Id = 1, Name = "Kg" }
            };

            mockRepository
                .Setup(repo => repo.CreateProduct(It.IsAny<Product>()))
                .ReturnsAsync(createdProductWithImage);

            var service = new ProductService(mockRepository.Object);
            #endregion

            #region Act
            var result = await service.CreateProduct(request, requireImage: true);
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.Equal("Banana", result.ProductName);
            Assert.Equal(imageUrl, result.ImageUrl); // URL correct opgeslagen
            mockRepository.Verify(r => r.SaveProductImageAsync(It.IsAny<IFormFile>()), Times.Once);
            #endregion
        }
    }
}
