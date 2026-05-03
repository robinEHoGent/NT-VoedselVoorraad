using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nimble_It.Api.Contracts.storageTypeContracts
{
    public class StorageTypeRequestContract
    {
        public required string StorageTypeName { get; set; }
    }
}
