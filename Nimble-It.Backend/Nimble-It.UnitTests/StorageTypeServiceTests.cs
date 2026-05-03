using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Nimble_It.Domain.Services;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.UnitTests
{
    public class StorageTypeServiceTests
    {
        [Fact]
        public async Task GetAllStorageTypes_ReturnsListStorageTypes()
        {
            #region Arrange
            var mockStorageRepository = new Mock<IStorageTypeRepository>();
            var mockInventoryRepository = new Mock<IInventoryRepository>();

            var storageEntities = new List<StorageType>
            {
                new StorageType { Id = 1, Name = "Fridge"},
                new StorageType { Id = 2, Name = "Freezer"},
                new StorageType { Id = 3, Name = "Cabinet"}
            };

            mockStorageRepository.Setup(repo => repo.GetAllStorageTypes()).ReturnsAsync(storageEntities);

            var service = new StorageTypeService(mockStorageRepository.Object, mockInventoryRepository.Object);
            #endregion

            #region Act
            var result = await service.GetAllStorageTypes();
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.Contains(result, st => st.StorageTypeId == 1 && st.StorageTypeName == "Fridge");
            Assert.Contains(result, st => st.StorageTypeId == 2 && st.StorageTypeName == "Freezer");
            Assert.Contains(result, st => st.StorageTypeId == 3 && st.StorageTypeName == "Cabinet");
            #endregion
        }

        [Fact]
        public async Task GetAllStorageTypes_WhenRepositoryReturnsEmpty_ReturnsEmptyList()
        {
            #region Assert
            var mockStorageRepository = new Mock<IStorageTypeRepository>();
            var mockInventoryRepository = new Mock<IInventoryRepository>();

            mockStorageRepository.Setup(repo => repo.GetAllStorageTypes()).ReturnsAsync(new List<StorageType>());

            var service = new StorageTypeService(mockStorageRepository.Object, mockInventoryRepository.Object);
            #endregion

            #region Act
            var result = await service.GetAllStorageTypes();
            #endregion

            #region Assert
            Assert.NotNull(result);
            Assert.Empty(result);
            #endregion
        }
    }
}