using Nimble_It.Api.Contracts.categoriesContracts;

namespace Nimble_It.Domain.Services.interfaces
{
    // Interface voor gesplitste category creatie endpoint
    public interface ICategoryService
    {
        Task<CategoryItemResponseContract> CreateCategory(CategoryRequestContract request);
        Task<List<CategoryItemResponseContract>> GetAllCategories();
        Task<List<CategorySimpleResponseContract>> GetAllCategoriesSimple();
    }
}
