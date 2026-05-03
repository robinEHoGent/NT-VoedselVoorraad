using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Persistence
{
    public class StorageTypeRepository(NimbleitDbContext context) : IStorageTypeRepository
    {
        public async Task<List<StorageType>> GetAllStorageTypes()
        {
            var storageTypesEntities = await context.StorageTypes.ToListAsync();
            return storageTypesEntities;
        }

        public async Task<int?> GetStorageTypeIdByName(string name)
        {
            var storageTypeId = await context.StorageTypes
                .Where(st => st.Name == name)
                .Select(st => st.Id)
                .FirstOrDefaultAsync();
            return storageTypeId;
        }

        public async Task<StorageType> CreateStorageType(StorageType storageType)
        {
            context.StorageTypes.Add(storageType);
            await context.SaveChangesAsync();
            return storageType;
        }
    }
}