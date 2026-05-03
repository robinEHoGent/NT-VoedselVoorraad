using Microsoft.AspNetCore.Mvc;
using Nimble_It.Api.Contracts.categoriesContracts;
using Nimble_It.Domain.Services.interfaces;

namespace Nimble_It.Controllers
{
    // Nieuwe controller: splitst category creatie af van inventory endpoint voor overzichtelijkere API
    [ApiController]
    [Route("api/categories")]
    public class CategoryController(ICategoryService service) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<CategoryItemResponseContract>> CreateCategory(
            [FromBody] CategoryRequestContract request
        )
        {
            try
            {
                var result = await service.CreateCategory(request);
                return CreatedAtAction(
                    nameof(CreateCategory),
                    new { id = result.CategoryId },
                    result
                );
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/categories
        [HttpGet]
        public async Task<ActionResult<List<CategoryItemResponseContract>>> GetAllCategories()
        {
            try
            {
                var result = await service.GetAllCategories();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/categories/simple
        [HttpGet("simple")]
        public async Task<
            ActionResult<List<CategorySimpleResponseContract>>
        > GetAllCategoriesSimple()
        {
            try
            {
                var result = await service.GetAllCategoriesSimple();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
