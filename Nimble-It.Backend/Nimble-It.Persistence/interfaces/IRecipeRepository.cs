using Nimble_It.Api.Contracts.recipesContracts;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Persistence.interfaces
{
    public interface IRecipeRepository
    {
        Task<List<Recipe>> GetAllRecipes(int page, int amountPage);
        Task<List<Recipe>> GetAllUnmakableRecipes(int page, int amountPage);
        Task<Dictionary<Recipe, bool>> GetAllRecipesFiltered(
            int page,
            int amountPage,
            string? name,
            List<string>? tag,
            bool? favorite
        );
        Task<int> GetFilteredCount(string? name, List<string>? tag, bool? favorite);
        Task<Dictionary<Recipe, bool>> GetLastCookedRecipes(int amountPage);
        Task<Recipe> GetRecipe(int id);
        Task<int> GetCount(bool Cookable);
        Task<Recipe> CreateRecipe(Recipe recipeEntity);
        Task AddTagsToRecipe(int recipeId, List<int> tagIds);
        Task AddRecipePartsToRecipe(int recipeId, List<RecipePartRequestContract> recipeParts);
        Task AddInstructionsToRecipe(int recipeId, List<InstructionRequestContract> instructions);
        Task<Recipe> UpdateRecipe(Recipe recipe);
        Task UpdateRecipeTags(int recipeId, List<int> tagIds);
        Task UpdateRecipeParts(int recipeId, List<RecipePartRequestContract> recipeParts);
        Task UpdateRecipeInstructions(int recipeId, List<InstructionRequestContract> instructions);
        Task UpdateLastCooked(int recipeId);
        Task ToggleFavorite(int recipeId);
        Task<bool> DeleteRecipe(int recipeId);
    }
}
