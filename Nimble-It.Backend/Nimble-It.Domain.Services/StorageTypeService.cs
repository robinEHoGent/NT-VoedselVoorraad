using Nimble_It.Api.Contracts.storageTypeContracts;
using Nimble_It.Domain.Services.interfaces;
using Nimble_It.Domain.Services.mappers;
using Nimble_It.Persistence.interfaces;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Domain.Services
{
    public class StorageTypeService(IStorageTypeRepository storageRepository, IInventoryRepository inventoryRepository) : IStorageTypeService
    {
        public async Task<List<StorageTypeResponseContract>> GetAllStorageTypes()
        {
            var storageTypesEntities = await storageRepository.GetAllStorageTypes();

            return storageTypesEntities.Select(st => st.ToModel().ToContract()).ToList();
        }

        public async Task<StorageTypeResponseContract> CreateStorageType(StorageTypeRequestContract request)
        {
            if (string.IsNullOrWhiteSpace(request.StorageTypeName))
                throw new ArgumentException("Storage type name is required");

            var storageType = new StorageType
            {
                Name = request.StorageTypeName
            };

            var created = await storageRepository.CreateStorageType(storageType);

            return new StorageTypeResponseContract
            {
                StorageTypeId = created.Id,
                StorageTypeName = created.Name
            };
        }

    }
}
