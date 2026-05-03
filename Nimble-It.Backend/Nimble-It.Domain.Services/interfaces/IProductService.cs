using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.productsContracts;

namespace Nimble_It.Domain.Services.interfaces
{
    public interface IProductService
    {
        Task<bool> DeleteProduct(int productId);
        Task<List<ProductResponseContract>> GetProducts();
        Task<ProductResponseContract> CreateProduct(ProductCreateRequestContract request, bool requireImage = false);
        Task<List<string>> GetAllBlobStorageImages();
    }
}
