using Nimble_It.Api.Contracts.recipesContracts;

namespace Nimble_It.Domain.Services.interfaces
{
    public interface IRecipeService
    {
        Task<List<RecipeResponseContract?>> GetAllRecipes(
            int page,
            int amountPage,
            string? name,
            List<string>? tag,
            bool? favorite,
            bool? isCookable
        );
        Task<List<RecipeResponseContract?>> GetLastCookedRecipes(int amountPage);
        Task<FullRecipeResponseContract?> GetRecipe(int id);
        Task<RecipeCountResponseContract> GetCount(bool Cookable);
        Task<int> GetFilteredCount(string? name, List<string>? tag, bool? favorite);
        Task<RecipeResponseContract> CreateRecipe(RecipeRequestContract recipeRequestContract);
        Task<RecipeResponseContract?> UpdateRecipe(
            RecipeRequestContract recipeRequestContract,
            int recipeId
        );
        Task UpdateLastCooked(int recipeId);
        Task ToggleFavorite(int recipeId);
        Task<bool> RemoveRecipe(int recipeId);
    }
}
