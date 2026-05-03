using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nimble_It.Api.Contracts.TagContracts
{
    public class TagResponseContract
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
}
