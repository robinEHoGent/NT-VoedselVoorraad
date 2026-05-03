using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.TagContracts;

namespace Nimble_It.Domain.Services.interfaces
{
    public interface ITagService
    {
        Task<List<TagResponseContract>> GetAllTagsAsync();
        Task<TagResponseContract?> GetTagById(int id);
        Task<TagResponseContract> CreateTagAsync(TagRequestContract request);
    }
}
