using Microsoft.AspNetCore.Mvc.Filters;
using Nimble_It.Api.Contracts.recipesContracts;
using Nimble_It.Domain.Services.interfaces;
using Nimble_It.Domain.Services.mappers;
using Nimble_It.Persistence;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Domain.Services
{
    public class RecipeService(IRecipeRepository recipeRepository) : IRecipeService
    {
        public async Task<List<RecipeResponseContract?>> GetAllRecipes(
            int page,
            int amountPage,
            string? name,
            List<string>? tag,
            bool? favorite,
            bool? isCookable
        )
        {
            if (isCookable == null)
            {
                var response = await recipeRepository.GetAllRecipesFiltered(
                    page,
                    amountPage,
                    name,
                    tag,
                    favorite
                );

                return [.. response.Select(resp => resp.Key.ToModel(resp.Value).ToContract())];
            }
            else
            {
                var response = new List<Recipe>();
                if (name != null || tag?.Count != 0 || favorite != null)
                    throw new ArgumentException("can not filter with makeable/unmakable recipes");
                if (isCookable == true)
                {
                    response = await recipeRepository.GetAllRecipes(page, amountPage);
                }
                else
                {
                    response = await recipeRepository.GetAllUnmakableRecipes(page, amountPage);
                }
                return [.. response.Select(r => r.ToModel().ToContract())];
            }
        }

        public async Task<List<RecipeResponseContract?>> GetLastCookedRecipes(int amountPage)
        {
            var response = await recipeRepository.GetLastCookedRecipes(amountPage);

            return [.. response.Select(resp => resp.Key.ToModel(resp.Value).ToContract())];
        }

        public async Task<int> GetFilteredCount(string? name, List<string>? tag, bool? favorite)
        {
            return await recipeRepository.GetFilteredCount(name, tag, favorite);
        }

        public async Task<FullRecipeResponseContract?> GetRecipe(int id)
        {
            try
            {
                var recipeEntity = await recipeRepository.GetRecipe(id);
                return recipeEntity.ToFullModel().ToFullContract();
            }
            catch (KeyNotFoundException)
            {
                return null;
            }
        }

        public async Task<RecipeCountResponseContract> GetCount(bool Cookable)
        {
            return new RecipeCountResponseContract()
            {
                Count = await recipeRepository.GetCount(Cookable),
            };
        }

        public async Task<RecipeResponseContract> CreateRecipe(
            RecipeRequestContract recipeRequestContract
        )
        {
            var recipeModel = recipeRequestContract.ToModel();
            var recipeEntity = recipeModel.ToEntity();

            // Create the recipe first
            var createdRecipeEntity = await recipeRepository.CreateRecipe(recipeEntity);

            // Add tags
            if (recipeModel.TagIds != null && recipeModel.TagIds.Any())
            {
                await recipeRepository.AddTagsToRecipe(createdRecipeEntity.Id, recipeModel.TagIds);
            }

            // Add recipe parts with products
            if (recipeModel.RecipeParts != null && recipeModel.RecipeParts.Any())
            {
                await recipeRepository.AddRecipePartsToRecipe(
                    createdRecipeEntity.Id,
                    recipeModel.RecipeParts
                );
            }

            // Add instructions
            if (recipeModel.InstructionRequests != null && recipeModel.InstructionRequests.Any())
            {
                await recipeRepository.AddInstructionsToRecipe(
                    createdRecipeEntity.Id,
                    recipeModel.InstructionRequests
                );
            }

            return createdRecipeEntity.ToModel().ToContract();
        }

        public async Task<RecipeResponseContract?> UpdateRecipe(
            RecipeRequestContract recipeRequestContract,
            int recipeId
        )
        {
            var recipeModel = recipeRequestContract.ToModel();
            recipeModel.Id = recipeId;

            try
            {
                var recipeEntity = recipeModel.ToEntity();

                // Update the basic recipe properties
                var updatedRecipeEntity = await recipeRepository.UpdateRecipe(recipeEntity);

                // Update tags (remove old ones and add new ones)
                if (recipeModel.TagIds != null)
                {
                    await recipeRepository.UpdateRecipeTags(recipeId, recipeModel.TagIds);
                }

                // Update recipe parts with products
                if (recipeModel.RecipeParts != null)
                {
                    await recipeRepository.UpdateRecipeParts(recipeId, recipeModel.RecipeParts);
                }

                // Update instructions
                if (recipeModel.InstructionRequests != null)
                {
                    await recipeRepository.UpdateRecipeInstructions(
                        recipeId,
                        recipeModel.InstructionRequests
                    );
                }

                return updatedRecipeEntity.ToModel().ToContract();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task UpdateLastCooked(int recipeId)
        {
            await recipeRepository.UpdateLastCooked(recipeId);
        }

        public async Task ToggleFavorite(int recipeId)
        {
            await recipeRepository.ToggleFavorite(recipeId);
        }

        public async Task<bool> RemoveRecipe(int recipeId)
        {
            try
            {
                return await recipeRepository.DeleteRecipe(recipeId);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
