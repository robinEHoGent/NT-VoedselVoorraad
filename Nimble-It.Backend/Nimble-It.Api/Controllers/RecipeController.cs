using System.Net;
using Microsoft.AspNetCore.Mvc;
using Nimble_It.Api.Contracts.recipesContracts;
using Nimble_It.Domain.Services.interfaces;

namespace Nimble_It.Controllers
{
    [ApiController]
    [Route("api/recipe")]
    public class RecipeController(IRecipeService recipeService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<RecipeResponseContract>>> GetAllAsync(
            [FromQuery] int page,
            [FromQuery] int amountPage,
            [FromQuery] string? name,
            [FromQuery] List<string>? tag,
            [FromQuery] bool? favorite,
            [FromQuery] bool? isCookable,
            [FromQuery] bool? countOnly = false
        )
        {
            try
            {
                if (countOnly == true)
                    return Ok(await recipeService.GetFilteredCount(name, tag, favorite));

                var ResponseList = await recipeService.GetAllRecipes(
                    page,
                    amountPage,
                    name,
                    tag,
                    favorite,
                    isCookable
                );
                if (ResponseList is null)
                {
                    return NotFound();
                }

                return Ok(ResponseList);
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
        }

        [HttpGet("{recipeId}")]
        public async Task<ActionResult<FullRecipeResponseContract>> GetAsync(
            [FromRoute] int recipeId
        )
        {
            var recipe = await recipeService.GetRecipe(recipeId);

            if (recipe == null)
            {
                return BadRequest();
            }
            return Ok(recipe);
        }

        [HttpGet("Cookable/{Cookable}")]
        public async Task<ActionResult<RecipeCountResponseContract>> GetCookableNumber(
            [FromRoute] bool Cookable
        )
        {
            return Ok(await recipeService.GetCount(Cookable));
        }

        [HttpGet("Last-cooked")]
        public async Task<ActionResult<List<RecipeResponseContract>>> GetLastCookedRecipes(
            [FromQuery] int amountPage
        )
        {
            var ResponseList = await recipeService.GetLastCookedRecipes(amountPage);

            if (ResponseList is null)
            {
                return NotFound();
            }
            return Ok(ResponseList);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecipeAsync(
            [FromForm] RecipeRequestContract recipeRequestContract
        )
        {
            var recipe = await recipeService.CreateRecipe(recipeRequestContract);
            return Ok(recipe);
        }

        [HttpPut("{recipeId}")]
        public async Task<ActionResult<RecipeResponseContract>> UpdateRecipeAsync(
            [FromForm] RecipeRequestContract recipeRequestContract,
            [FromRoute] int recipeId
        )
        {
            var updatedRecipe = await recipeService.UpdateRecipe(recipeRequestContract, recipeId);

            if (updatedRecipe is null)
                return BadRequest(new ProblemDetails { Detail = "Recipe not found." });

            return updatedRecipe;
        }

        [HttpPatch("{recipeId}/last-cooked")]
        public async Task<IActionResult> UpdateLastCookedAsync([FromRoute] int recipeId)
        {
            try
            {
                await recipeService.UpdateLastCooked(recipeId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ProblemDetails { Detail = "Recipe not found." });
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new ProblemDetails
                    {
                        Status = (int)HttpStatusCode.BadRequest,
                        Title = ex.Message,
                    }
                );
            }
        }

        [HttpPatch("{recipeId}/favorite")]
        public async Task<IActionResult> ToggleFavoriteAsync([FromRoute] int recipeId)
        {
            try
            {
                await recipeService.ToggleFavorite(recipeId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ProblemDetails { Detail = "Recipe not found." });
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new ProblemDetails
                    {
                        Status = (int)HttpStatusCode.BadRequest,
                        Title = ex.Message,
                    }
                );
            }
        }

        [HttpDelete("{recipeId}")]
        public async Task<IActionResult> DeleteRecipeAsync(int recipeId)
        {
            try
            {
                await recipeService.RemoveRecipe(recipeId);
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new ProblemDetails
                    {
                        Status = (int)HttpStatusCode.BadRequest,
                        Title = ex.Message,
                    }
                );
            }
            return NoContent();
        }
    }
}
