using Nimble_It.Api.Contracts.categoriesContracts;
using Nimble_It.Domain.Services.interfaces;
using Nimble_It.Domain.Services.mappers;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Domain.Services
{
    // Nieuwe service: handelt category creatie apart af ipv nested in inventory request
    public class CategoryService(ICategoryRepository repository) : ICategoryService
    {
        public async Task<CategoryItemResponseContract> CreateCategory(
            CategoryRequestContract request
        )
        {
            if (string.IsNullOrWhiteSpace(request.CategoryName))
                throw new ArgumentException("Category name is required");

            var category = new Category
            {
                Name = request.CategoryName,
                NotificationTime = request.NotificationTime,
            };

            var created = await repository.CreateCategory(category);

            return new CategoryItemResponseContract
            {
                CategoryId = created.Id,
                CategoryName = created.Name,
                NotificationTime = created.NotificationTime,
            };
        }

        public async Task<List<CategoryItemResponseContract>> GetAllCategories()
        {
            var categoriesEntities = await repository.GetAllCategories();
            return categoriesEntities.Select(c => c.ToModel().ToContract()).ToList();
        }

        public async Task<List<CategorySimpleResponseContract>> GetAllCategoriesSimple()
        {
            var categoriesEntities = await repository.GetAllCategories();
            return categoriesEntities
                .Select(c => new CategorySimpleResponseContract
                {
                    CategoryId = c.Id,
                    CategoryName = c.Name,
                    NotificationTime = c.NotificationTime,
                })
                .ToList();
        }
    }
}
