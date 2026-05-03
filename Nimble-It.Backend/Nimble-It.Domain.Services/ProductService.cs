using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Nimble_It.Api.Contracts.productsContracts;
using Nimble_It.Domain.Services.exceptions;
using Nimble_It.Domain.Services.interfaces;
using Nimble_It.Domain.Services.mappers;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Domain.Services
{
    public class ProductService(IProductRepository repository) : IProductService
    {
        public async Task<bool> DeleteProduct(int productId)
        {
            try
            {
                await repository.DeleteProduct(productId);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<ProductResponseContract>> GetProducts()
        {
            var productsResult = await repository.GetAllProducts();
            var productContracts = productsResult
                .Select(product =>
                {
                    return product.ToModelNoCategory().ToContractProduct();
                })
                .ToList();
            return productContracts;
        }

        // Product creatie met optionele image upload
        public async Task<ProductResponseContract> CreateProduct(
            ProductCreateRequestContract request,
            bool requireImage = false
        )
        {
            // Productnaam validatie (mag ni leeg zijn)
            if (string.IsNullOrWhiteSpace(request.ProductName))
            {
                throw new InvalidProductException("Product name cannot be empty");
            }

            if (request.CategoryId <= 0)
                throw new ArgumentException("CategoryId is required");

            if (request.UomId <= 0)
                throw new ArgumentException("UomId is required");

            //CHECK1=
            // VALIDATIE= requireImage true? ImageFile MOET aanwezig zijn anders error
            if (requireImage && request.ImageFile == null)
            {
                throw new ArgumentException("Image is required when requireImage is true");
            }

            //CHECK2= requireImage false? ImageFile MAG NIET aanwezig zijn anders error
            if (!requireImage && request.ImageFile != null)
            {
                throw new ArgumentException(
                    "Image should not be provided when requireImage is false"
                );
            }

            //CHECK3= (nullcheck) alleen uploaden alst er effectief nen file is
            // task 216: geuploade image wordt opgeslaan + url (optioneel)
            string? imageUrl = null;
            if (request.ImageFile != null)
            {
                imageUrl = await repository.SaveProductImageAsync(request.ImageFile);
            }
            else if (!string.IsNullOrWhiteSpace(request.ImageUrl))
            {
                // If ImageUrl is provided directly (from blob storage selection), use it
                imageUrl = request.ImageUrl;
            }

            // Product creatie
            var product = new Product
            {
                Name = request.ProductName,
                CategoryId = request.CategoryId,
                UomId = request.UomId,
                ImageUrl = imageUrl, // task 216: store URL
            };

            var createdProduct = await repository.CreateProduct(product);

            return createdProduct.ToModelNoCategory().ToContractProduct();
        }

        public async Task<List<string>> GetAllBlobStorageImages()
        {
            return await repository.GetAllBlobImageUrlsAsync();
        }
    }
}
