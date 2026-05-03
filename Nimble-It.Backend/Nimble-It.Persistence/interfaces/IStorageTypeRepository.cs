using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Persistence.interfaces
{
    public interface IStorageTypeRepository
    {
        Task<List<StorageType>> GetAllStorageTypes();
        Task<int?> GetStorageTypeIdByName(string name);
        Task<StorageType> CreateStorageType(StorageType storageType);
    }
}