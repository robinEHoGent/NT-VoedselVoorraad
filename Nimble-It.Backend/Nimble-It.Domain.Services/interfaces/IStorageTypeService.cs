using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.storageTypeContracts;
using Nimble_It.Api.Contracts.inventoryContracts;

namespace Nimble_It.Domain.Services.interfaces
{
    public interface IStorageTypeService
    {
        Task<List<StorageTypeResponseContract>> GetAllStorageTypes();
        Task<StorageTypeResponseContract> CreateStorageType(StorageTypeRequestContract request);
    }
    
}
