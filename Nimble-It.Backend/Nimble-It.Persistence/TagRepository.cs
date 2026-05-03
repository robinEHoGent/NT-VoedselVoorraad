using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.exceptions;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Persistence
{
    public class TagRepository(NimbleitDbContext context) : ITagRepository
    {
        public async Task<List<Tag>> GetAllTagsAsync()
        {
            var tags = await context.Tags.ToListAsync();
            return tags;
        }

        public async Task<Tag?> GetTagByIdAsync(int id)
        {
            return await context.Tags.FindAsync(id);
        }

        public async Task<Tag> CreateTagAsync(Tag tag)
        {
            var existingTag = await context.Tags.FirstOrDefaultAsync(t =>
                t.Name.ToLower() == tag.Name.ToLower()
            );

            if (existingTag != null)
            {
                throw new DuplicateTagException(tag.Name);
            }

            context.Tags.Add(tag);
            await context.SaveChangesAsync();
            return tag;
        }
    }
}
