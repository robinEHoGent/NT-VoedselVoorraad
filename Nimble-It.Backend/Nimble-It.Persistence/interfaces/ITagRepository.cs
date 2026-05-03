using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Persistence.interfaces
{
    public interface ITagRepository
    {
        Task<List<Tag>> GetAllTagsAsync();
        Task<Tag?> GetTagByIdAsync(int id);
        Task<Tag> CreateTagAsync(Tag tag);
    }
}
