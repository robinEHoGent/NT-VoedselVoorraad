using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nimble_It.Api.Contracts.storageTypeContracts
{
    public class StorageTypeResponseContract
    {
        public int StorageTypeId { get; set; }
        public string StorageTypeName { get; set; } = string.Empty;
    }
}