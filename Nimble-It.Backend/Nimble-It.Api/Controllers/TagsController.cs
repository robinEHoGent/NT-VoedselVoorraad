using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Nimble_It.Api.Contracts.TagContracts;
using Nimble_It.Domain.Services.interfaces;
using Nimble_It.Persistence.exceptions;

namespace Nimble_It.Controllers
{
    [ApiController]
    [Route("api/tags")]
    public class TagsController(ITagService service) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<TagResponseContract>>> GetAllTagsAsync()
        {
            var result = await service.GetAllTagsAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TagResponseContract>> GetTagById(int id)
        {
            var result = await service.GetTagById(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<TagResponseContract>> CreateTagAsync(
            [FromBody] TagRequestContract request
        )
        {
            try
            {
                var result = await service.CreateTagAsync(request);
                return CreatedAtAction(nameof(GetTagById), new { id = result.Id }, result);
            }
            catch (DuplicateTagException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
    }
}
