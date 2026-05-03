using System.Net;
using Microsoft.AspNetCore.Mvc;
using Nimble_It.Api.Contracts.shoppinglistContracts;
using Nimble_It.Domain.Services.interfaces;

namespace Nimble_It.Controllers
{
    [ApiController]
    [Route("api/shoppinglist")]
    public class ShoppinglistController(IShoppingListService shoppinglistService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<ShoppingListResponseContract>> GetAllShoppingListItems()
        {
            var shoppinglist = await shoppinglistService.GetShoppingListItems();
            return Ok(shoppinglist);
        }

        [HttpGet("{shoppinglistItemId}")]
        public async Task<ActionResult<ShoppingListItemResponseContract>> GetShoppingListItem(
            [FromRoute] int shoppinglistItemId
        )
        {
            var shoppinglistItem = await shoppinglistService.GetShoppingListItem(
                shoppinglistItemId
            );

            if (shoppinglistItem == null)
            {
                return NotFound();
            }
            return Ok(shoppinglistItem);
        }

        [HttpPost]
        public async Task<ActionResult> CreateShoppingListItem(
            [FromBody] ShoppingListItemRequestContract shoppingListItemRequestContract
        )
        {
            var shoppinglistItem = await shoppinglistService.CreateShoppingListItem(
                shoppingListItemRequestContract
            );
            return CreatedAtAction(
                nameof(GetShoppingListItem),
                new { shoppinglistItemId = shoppinglistItem.Id },
                shoppinglistItem
            );
        }

        [HttpPut("{shoppinglistItemId}")]//specifiek amount of volledig weglaten => locale storage
        public async Task<ActionResult<ShoppingListItemResponseContract>> UpdateShoppingListItem(
            [FromBody] ShoppingListItemRequestContract shoppingListItemRequestContract,
            [FromRoute] int shoppinglistItemId
        )
        {
            var updatedShoppingListItem = await shoppinglistService.UpdateShoppinglistItem(
                shoppingListItemRequestContract,
                shoppinglistItemId
            );

            if (updatedShoppingListItem is null)
                return BadRequest(new ProblemDetails { Detail = "Shopping list item not found." });

            return updatedShoppingListItem;
        }

        [HttpDelete("{shoppinglistItemId}")]
        public async Task<ActionResult> DeleteShoppingListItem([FromRoute] int shoppinglistItemId)
        {
            try
            {
                await shoppinglistService.RemoveShoppingListItem(shoppinglistItemId);
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
