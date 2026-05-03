using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.TagContracts;
using Nimble_It.Domain.Services.interfaces;
using Nimble_It.Domain.Services.mappers;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Domain.Services
{
    public class TagService(ITagRepository repository) : ITagService
    {
        public async Task<List<TagResponseContract>> GetAllTagsAsync()
        {
            var result = await repository.GetAllTagsAsync();
            return result.Select(tag => tag.ToModel().ToContract()).ToList();
        }

        public async Task<TagResponseContract?> GetTagById(int id)
        {
            var tag = await repository.GetTagByIdAsync(id);
            return tag?.ToModel().ToContract();
        }

        public async Task<TagResponseContract> CreateTagAsync(TagRequestContract request)
        {
            var tag = request.ToEntity();
            var created = await repository.CreateTagAsync(tag);
            return created.ToModel().ToContract();
        }
    }
}
