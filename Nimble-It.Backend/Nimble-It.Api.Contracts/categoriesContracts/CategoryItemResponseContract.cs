using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.productsContracts;

namespace Nimble_It.Api.Contracts.categoriesContracts
{
    public class CategoryItemResponseContract
    {
        public int CategoryId { get; set; }

        public string CategoryName { get; set; } = null!;

        public int? NotificationTime { get; set; }

        public List<ProductItemResponseContract> Products { get; set; } = [];
    }
}
