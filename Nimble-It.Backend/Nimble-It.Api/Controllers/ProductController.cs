using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Nimble_It.Api.Contracts.inventoryContracts;
using Nimble_It.Api.Contracts.productsContracts;
using Nimble_It.Domain.Services.exceptions;
using Nimble_It.Domain.Services.interfaces;

namespace Nimble_It.Controllers
{
    [ApiController]
    [Route("api/product")]
    public class ProductController(IProductService service) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<ProductResponseContract>> GetProducts()
        {
            var productResult = await service.GetProducts();
            return Ok(productResult);
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            var response = await service.DeleteProduct(productId);
            if (!response)
                return BadRequest();

            return NoContent();
        }

        // Product creatie met query parameter om image requirement te bepalen
        [HttpPost]
        public async Task<ActionResult<ProductResponseContract>> CreateProduct(
            [FromForm] ProductCreateRequestContract request,
            [FromQuery] bool requireImage = false
        )
        {
            try
            {
                var product = await service.CreateProduct(request, requireImage);
                return CreatedAtAction(
                    nameof(GetProducts),
                    new { id = product.ProductId },
                    product
                );
            }
            catch (InvalidProductException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("images")]
        public async Task<ActionResult<IEnumerable<string>>> GetBlobStorageImages()
        {
            try
            {
                var images = await service.GetAllBlobStorageImages();
                return Ok(images);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching images: {ex.Message}");
            }
        }
    }
}
