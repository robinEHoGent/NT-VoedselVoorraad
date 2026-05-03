using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nimble_It.Domain.Models
{
    public class ProductModel
    {
        public int Id { get; set; }

        public string? Name { get; set; } = null!;

        // decontructing because only 1 value
        public string? UOMName { get; set; } = null!;

        public string? ImageUrl { get; set; } // task 216

        public CategoryModel? Category { get; set; } = null!;
    }
}
