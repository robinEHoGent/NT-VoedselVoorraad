using Microsoft.AspNetCore.Mvc;
using Nimble_It.Api.Contracts.inventoryContracts;
using Nimble_It.Api.Contracts.storageTypeContracts;
using Nimble_It.Domain.Services.interfaces;

namespace Nimble_It.Controllers
{
    [ApiController]
    [Route("api/storagetypes")]
    public class StorageTypeController(IStorageTypeService service) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<StorageTypeResponseContract>> GetAllStorageTypes()
        {
            var inventoryResult = await service.GetAllStorageTypes();
            return Ok(inventoryResult);
        }

        [HttpPost]
        public async Task<ActionResult<StorageTypeResponseContract>> CreateStorageType([FromBody] StorageTypeRequestContract request)
        {
            try
            {
                var result = await service.CreateStorageType(request);
                return CreatedAtAction(nameof(CreateStorageType), new { id = result.StorageTypeId }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
