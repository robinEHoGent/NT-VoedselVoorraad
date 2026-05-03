using Microsoft.EntityFrameworkCore;
using Nimble_It.Api.Contracts.recipesContracts;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.exceptions;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Persistence
{
    public class RecipeRepository(NimbleitDbContext context) : IRecipeRepository
    {
        private IQueryable<Recipe> GetRecipesByMakeability(bool makeable)
        {
            var aggregatedInventory = context
                .Inventories.GroupBy(i => i.ProductId)
                .Select(g => new { IngredientId = g.Key, TotalQuantity = g.Sum(i => i.Amount) });

            return makeable
                ? context.Recipes.Where(r =>
                    r.RecipeInfos.Count(ri =>
                        !aggregatedInventory.Any(ai =>
                            ai.IngredientId == ri.ProductId && ai.TotalQuantity >= ri.Amount
                        )
                    ) == 0
                )
                : context.Recipes.Where(r =>
                    r.RecipeInfos.Count(ri =>
                        !aggregatedInventory.Any(ai =>
                            ai.IngredientId == ri.ProductId && ai.TotalQuantity >= ri.Amount
                        )
                    ) != 0
                );
        }

        public async Task<List<Recipe>> GetAllRecipes(int page, int amountPage)
        {
            return await GetRecipesByMakeability(true)
                .Skip((page - 1) * amountPage)
                .Take(amountPage)
                .ToListAsync();
        }

        public async Task<List<Recipe>> GetAllUnmakableRecipes(int page, int amountPage)
        {
            return await GetRecipesByMakeability(false)
                .Skip((page - 1) * amountPage)
                .Take(amountPage)
                .ToListAsync();
        }

        public async Task<Dictionary<Recipe, bool>> GetLastCookedRecipes(int amountPage)
        {
            var foundRecipes = await context
                .Recipes.Where(r => r.LastCooked != null)
                .OrderByDescending(r => r.LastCooked)
                .Take(amountPage)
                .ToListAsync();

            var cookableRecipes = GetRecipesByMakeability(true).ToList();

            Dictionary<Recipe, bool> Recipes = [];

            foreach (Recipe recipe in foundRecipes)
            {
                if (cookableRecipes.Contains(recipe))
                {
                    Recipes.Add(recipe, true);
                }
                else
                {
                    Recipes.Add(recipe, false);
                }
            }
            return Recipes;
        }

        public async Task<Dictionary<Recipe, bool>> GetAllRecipesFiltered(
            int page,
            int amountPage,
            string? name,
            List<string>? tag,
            bool? favorite
        )
        {
            var query = BuildFilteredRecipeQuery(name, tag, favorite);

            query = query.Skip((page - 1) * amountPage).Take(amountPage);

            var cookableRecipes = GetRecipesByMakeability(true).ToList();

            var foundRecipes = await query.ToListAsync();

            Dictionary<Recipe, bool> Recipes = [];

            foreach (Recipe recipe in foundRecipes)
            {
                if (cookableRecipes.Contains(recipe))
                {
                    Recipes.Add(recipe, true);
                }
                else
                {
                    Recipes.Add(recipe, false);
                }
            }
            return Recipes;
        }

        public async Task<int> GetFilteredCount(string? name, List<string>? tag, bool? favorite)
        {
            var query = BuildFilteredRecipeQuery(name, tag, favorite);
            return await query.CountAsync();
        }

        private IQueryable<Recipe> BuildFilteredRecipeQuery(
            string? name,
            List<string>? tag,
            bool? favorite
        )
        {
            IQueryable<Recipe> query = context.Recipes;

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(r => EF.Functions.Like(r.Name, $"%{name}%"));
            }

            if (tag != null && tag.Count != 0)
            {
                query = query.Where(r =>
                    tag.All(tagName => r.RecipeTags.Any(rt => rt.Tag!.Name == tagName))
                );
            }

            if (favorite != null)
            {
                if (favorite == true)
                {
                    query = query.Where(r => r.Favorite);
                }
                else
                {
                    query = query.Where(r => !r.Favorite);
                }
            }

            return query;
        }

        public async Task<Recipe> GetRecipe(int id)
        {
            return await context
                    .Recipes.Include(r => r.RecipeInfos)
                    .ThenInclude(ri => ri.Product)
                    .ThenInclude(p => p!.Uom)
                    .Include(r => r.Instructions)
                    .Include(r => r.RecipeTags)
                    .ThenInclude(rt => rt.Tag)
                    .FirstOrDefaultAsync(r => r.Id == id) ?? throw new KeyNotFoundException();
        }

        public async Task<int> GetCount(bool Cookable)
        {
            return GetRecipesByMakeability(Cookable).Count();
        }

        public async Task<Recipe> CreateRecipe(Recipe recipeEntity)
        {
            await context.Recipes.AddAsync(recipeEntity);
            await context.SaveChangesAsync();
            return recipeEntity;
        }

        public async Task AddTagsToRecipe(int recipeId, List<int> tagIds)
        {
            var recipeTags = tagIds.Select(tagId => new RecipeTag
            {
                RecipeId = recipeId,
                TagId = tagId,
            });

            await context.RecipeTags.AddRangeAsync(recipeTags);
            await context.SaveChangesAsync();
        }

        public async Task AddRecipePartsToRecipe(
            int recipeId,
            List<RecipePartRequestContract> recipeParts
        )
        {
            var recipeInfos = new List<RecipeInfo>();

            for (int partIndex = 0; partIndex < recipeParts.Count; partIndex++)
            {
                var part = recipeParts[partIndex];
                foreach (var product in part.Products)
                {
                    recipeInfos.Add(
                        new RecipeInfo
                        {
                            RecipeId = recipeId,
                            ProductId = product.ProductId,
                            Amount = (decimal)product.Amount,
                            Part = partIndex + 1,
                            Title = part.Title,
                        }
                    );
                }
            }

            await context.RecipeInfos.AddRangeAsync(recipeInfos);
            await context.SaveChangesAsync();
        }

        public async Task AddInstructionsToRecipe(
            int recipeId,
            List<InstructionRequestContract> instructions
        )
        {
            var instructionEntities = instructions.Select(
                (inst, index) =>
                    new Instruction
                    {
                        RecipeId = recipeId,
                        Step = index + 1,
                        Header = inst.Header,
                        Text = inst.Text,
                    }
            );

            await context.Instructions.AddRangeAsync(instructionEntities);
            await context.SaveChangesAsync();
        }

        public async Task<Recipe> UpdateRecipe(Recipe recipe)
        {
            var existingRecipe = await GetRecipe(recipe.Id);

            if (existingRecipe is null)
                throw new RecipeNotFoundException(recipe.Id);

            existingRecipe.Name = recipe.Name;
            existingRecipe.Description = recipe.Description ?? existingRecipe.Description;
            existingRecipe.ServingSize = recipe.ServingSize ?? existingRecipe.ServingSize;
            existingRecipe.PrepareTime = recipe.PrepareTime ?? existingRecipe.PrepareTime;
            existingRecipe.Complexity = recipe.Complexity ?? existingRecipe.Complexity;
            existingRecipe.ImageUrl = recipe.ImageUrl ?? existingRecipe.ImageUrl;

            await context.SaveChangesAsync();

            return existingRecipe;
        }

        public async Task UpdateRecipeTags(int recipeId, List<int> tagIds)
        {
            // Remove existing tags
            var existingTags = context.RecipeTags.Where(rt => rt.RecipeId == recipeId);
            context.RecipeTags.RemoveRange(existingTags);

            // Add new tags
            var recipeTags = tagIds.Select(tagId => new RecipeTag
            {
                RecipeId = recipeId,
                TagId = tagId,
            });

            await context.RecipeTags.AddRangeAsync(recipeTags);
            await context.SaveChangesAsync();
        }

        public async Task UpdateRecipeParts(
            int recipeId,
            List<RecipePartRequestContract> recipeParts
        )
        {
            // Remove existing recipe parts
            var existingParts = context.RecipeInfos.Where(ri => ri.RecipeId == recipeId);
            context.RecipeInfos.RemoveRange(existingParts);

            // Add new recipe parts
            var recipeInfos = new List<RecipeInfo>();

            for (int partIndex = 0; partIndex < recipeParts.Count; partIndex++)
            {
                var part = recipeParts[partIndex];
                foreach (var product in part.Products)
                {
                    recipeInfos.Add(
                        new RecipeInfo
                        {
                            RecipeId = recipeId,
                            ProductId = product.ProductId,
                            Amount = (decimal)product.Amount,
                            Part = partIndex + 1,
                            Title = part.Title,
                        }
                    );
                }
            }

            await context.RecipeInfos.AddRangeAsync(recipeInfos);
            await context.SaveChangesAsync();
        }

        public async Task UpdateRecipeInstructions(
            int recipeId,
            List<InstructionRequestContract> instructions
        )
        {
            // Remove existing instructions
            var existingInstructions = context.Instructions.Where(i => i.RecipeId == recipeId);
            context.Instructions.RemoveRange(existingInstructions);

            // Add new instructions
            var instructionEntities = instructions.Select(
                (inst, index) =>
                    new Instruction
                    {
                        RecipeId = recipeId,
                        Step = index + 1,
                        Header = inst.Header,
                        Text = inst.Text,
                    }
            );

            await context.Instructions.AddRangeAsync(instructionEntities);
            await context.SaveChangesAsync();
        }

        public async Task UpdateLastCooked(int recipeId)
        {
            var recipe = await context.Recipes.FindAsync(recipeId);

            if (recipe is null)
                throw new KeyNotFoundException($"Recipe with ID {recipeId} not found.");

            recipe.LastCooked = DateTime.UtcNow;
            await context.SaveChangesAsync();
        }

        public async Task ToggleFavorite(int recipeId)
        {
            var recipe = await context.Recipes.FindAsync(recipeId);

            if (recipe is null)
                throw new KeyNotFoundException($"Recipe with ID {recipeId} not found.");

            recipe.Favorite = !recipe.Favorite;
            await context.SaveChangesAsync();
        }

        public async Task<bool> DeleteRecipe(int recipeId)
        {
            var existingRecipe = await GetRecipe(recipeId);

            if (existingRecipe is null)
                throw new RecipeNotFoundException(recipeId);

            context.Recipes.Remove(existingRecipe);
            await context.SaveChangesAsync();

            return true;
        }
    }
}
