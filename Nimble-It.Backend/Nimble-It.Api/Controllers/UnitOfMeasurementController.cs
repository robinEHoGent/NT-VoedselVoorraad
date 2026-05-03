using Microsoft.AspNetCore.Mvc;
using Nimble_It.Api.Contracts.unitOfMeasurementContracts;
using Nimble_It.Domain.Services.interfaces;

namespace Nimble_It.Controllers
{
    // Nieuwe controller: splitst UoM creatie af van inventory endpoint voor betere error handling per stap
    [ApiController]
    [Route("api/unitsofmeasurement")]
    public class UnitOfMeasurementController(IUnitOfMeasurementService service) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<UnitOfMeasurementResponseContract>> CreateUnitOfMeasurement(
            [FromBody] UnitOfMeasurementRequestContract request
        )
        {
            try
            {
                var result = await service.CreateUnitOfMeasurement(request);
                return CreatedAtAction(
                    nameof(CreateUnitOfMeasurement),
                    new { id = result.Id },
                    result
                );
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/unitsofmeasurement
        [HttpGet]
        public async Task<ActionResult<List<UnitOfMeasurementResponseContract>>> GetAllUnits()
        {
            try
            {
                var result = await service.GetAllUnits();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/unitsofmeasurement/simple
        [HttpGet("simple")]
        public async Task<ActionResult<List<UnitOfMeasurementResponseContract>>> GetAllUnitsSimple()
        {
            try
            {
                var result = await service.GetAllUnitsSimple();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
