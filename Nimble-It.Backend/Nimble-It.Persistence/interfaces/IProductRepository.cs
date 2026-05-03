using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Persistence.interfaces
{
    public interface IProductRepository
    {
        Task DeleteProduct(int productId);
        Task<List<Product>> GetAllProducts();
        Task<Product> CreateProduct(Product product); //task221
        Task<string> SaveProductImageAsync(IFormFile file);
        Task DeleteProductImageAsync(string imageUrl);
        Task<List<string>> GetAllBlobImageUrlsAsync();
    }
}
