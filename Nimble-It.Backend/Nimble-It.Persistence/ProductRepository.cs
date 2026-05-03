using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Nimble_It.Persistence;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Persistence
{
    // aangemaakte Azure Resources:
    // Resource Group: nimbleit-rg (westeurope)
    // Storage Account: nimbleitblob
    // Containernaam: products
    public class ProductRepository(NimbleitDbContext context, BlobContainerClient containerClient)
        : IProductRepository
    {
        private BlobClient GetBlobClient(string fileName)
        {
            return containerClient.GetBlobClient(fileName);
        }

        public async Task DeleteProduct(int productId)
        {
            Product? product = await (
                context.Products.FirstAsync(product => productId == product.Id)
                ?? throw new Exception("product not found")
            );
            context.Products.Remove(product!);
            await context.SaveChangesAsync();
        }

        public async Task<List<Product>> GetAllProducts()
        {
            var productsResult = await context.Products.Include(p => p.Uom).ToListAsync();

            return productsResult;
        }

        public async Task<Product> CreateProduct(Product product) //task221 & 225 (save to db/add input to db)
        {
            await context.Products.AddAsync(product);
            await context.SaveChangesAsync();
            return await context.Products.Include(p => p.Uom).FirstAsync(p => p.Id == product.Id);
        }

        public async Task<string> SaveProductImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return string.Empty;

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var blobClient = GetBlobClient(fileName);

            using var stream = file.OpenReadStream();
            await blobClient.UploadAsync(
                stream,
                new BlobHttpHeaders { ContentType = file.ContentType }
            );

            return blobClient.Uri.ToString();
        }

        public async Task DeleteProductImageAsync(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return;

            var uri = new Uri(imageUrl);
            var blobName = Path.GetFileName(uri.LocalPath);
            var blobClient = GetBlobClient(blobName);

            await blobClient.DeleteIfExistsAsync();
        }

        public async Task<List<string>> GetAllBlobImageUrlsAsync()
        {
            var imageUrls = new List<string>();
            await foreach (var blobItem in containerClient.GetBlobsAsync())
            {
                var blobClient = containerClient.GetBlobClient(blobItem.Name);
                imageUrls.Add(blobClient.Uri.ToString());
            }
            return imageUrls;
        }
    }
}
