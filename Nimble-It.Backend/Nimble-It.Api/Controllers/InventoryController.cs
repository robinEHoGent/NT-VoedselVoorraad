using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Nimble_It.Api.Contracts.inventoryContracts;
using Nimble_It.Api.Contracts.storageTypeContracts;
using Nimble_It.Domain.Services.interfaces;

namespace Nimble_It.Controllers
{
    [ApiController]
    [Route("api/inventory")]
    public class InventoryController(IInventoryService service) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<InventoryDataResponseContract>> GetAllInventoryItems()
        {
            var inventoryResult = await service.GetAllInventoryItems();
            return Ok(inventoryResult);
        }

        [HttpGet("{inventoryId}")]
        public async Task<ActionResult<InventoryItemResponseContract>> GetInventoryItem([FromRoute] int inventoryId)
        {
            var inventoryItem = await service.GetById(inventoryId);

            if (inventoryItem is null)
                return NotFound();
            
            return inventoryItem;
        }

        [HttpPut("{inventoryId}/storage-type")] 
        public async Task<ActionResult<InventoryItemResponseContract>> UpdateStorageTypeInventory(
            [FromRoute] int inventoryId, [FromBody] StorageTypeRequestContract storageTypeRequest)
        {
            try {
                var updatedInventoryItem = await service.UpdateStorageTypeInventory(inventoryId, storageTypeRequest.StorageTypeName);

                if (updatedInventoryItem is null)
                    return NotFound();
                
                return updatedInventoryItem;
            } catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpDelete("{inventoryItemId}")]
        public async Task<ActionResult> DeleteInventoryItem([FromRoute] int inventoryItemId)
        {
            var deleteResult = await service.DeleteInventoryItem(inventoryItemId);
            if (!deleteResult)
                return BadRequest();
            return NoContent();
        }

        [HttpPut("{inventoryId}/amount")]
        public async Task<ActionResult<InventoryItemResponseContract>> UpdateQuantityInventoryItem([FromRoute] int inventoryId, [FromBody] decimal amount)
        {
            try {
                var updatedInventoryItem = await service.UpdateAmountInventory(inventoryId, amount);

                if (updatedInventoryItem is null)
                    return NotFound();

                // item is deleted
                if (updatedInventoryItem.InventoryId == 0) 
                    return NoContent();
                
                return updatedInventoryItem;
            } catch (InvalidOperationException ex)
            {
                // Onvoldoende voorraad (409)
                return Conflict(new ProblemDetails
                {
                    Detail = ex.Message
                });
            }
        }

        [HttpPost]
        public async Task<ActionResult<InventoryItemResponseContract>> AddInventoryItem(
            [FromBody] AddInventoryItemRequestContract request
        )
        {
            try
            {
                var result = await service.AddInventoryItem(request);
                return CreatedAtAction(
                    nameof(GetAllInventoryItems),
                    new { id = result.InventoryId },
                    result
                );
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
