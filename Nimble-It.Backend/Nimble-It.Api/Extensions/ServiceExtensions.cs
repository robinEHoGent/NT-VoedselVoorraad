using Azure.Storage.Blobs;
using Nimble_It.Domain.Services;
using Nimble_It.Domain.Services.interfaces;
using Nimble_It.Persistence;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Api.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services,
            IConfiguration configuration
        )
        { //US2 Task 220
            // service layer verzameling
            services.AddScoped<IInventoryService, InventoryService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IShoppingListService, ShoppingListService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IUnitOfMeasurementService, UnitOfMeasurementService>();
            services.AddScoped<IStorageTypeService, StorageTypeService>();
            services.AddScoped<IRecipeService, RecipeService>();
            services.AddScoped<ITagService, TagService>();

            return services;
        }

        public static async Task<IServiceCollection> AddApplicationRepositories(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            // task 216: Azure Blob Storage (in repo laag zoals in cursus van prg3)
            var blob = new BlobServiceClient(
                Environment.GetEnvironmentVariable("AZURITE_BLOB_CONNECTIONSTRING")
            ).GetBlobContainerClient(configuration["BlobStorage:ContainerName"] ?? "products");
            blob.CreateIfNotExists();
            services.AddSingleton(blob);

            // repo layer
            services.AddScoped<IInventoryRepository, InventoryRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IShoppingListRepository, ShoppingListRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IUnitOfMeasurementRepository, UnitOfMeasurementRepository>();
            services.AddScoped<IRecipeRepository, RecipeRepository>();
            services.AddScoped<IStorageTypeRepository, StorageTypeRepository>();
            services.AddScoped<ITagRepository, TagRepository>();

            // InventoryRepository handled creatie van entiteiten via DbContext helper methods

            return services;
        }
    }
}
