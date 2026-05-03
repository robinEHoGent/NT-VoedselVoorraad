using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.storageTypeContracts;
using Nimble_It.Domain.Models;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Domain.Services.mappers
{
    public static class StorageTypeMapper
    {
        public static StorageTypeModel ToModel(this StorageType storageTypeEntity)
        {
            return new StorageTypeModel
            {
                Id = storageTypeEntity.Id,
                Name = storageTypeEntity.Name
            };
        }
        public static StorageTypeResponseContract ToContract(this StorageTypeModel storageTypeModel)
        {
            return new StorageTypeResponseContract
            {
                StorageTypeId = storageTypeModel.Id,
                StorageTypeName = storageTypeModel.Name
            };
        }
    }
}