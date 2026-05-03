using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Persistence
{
    public class CategoryRepository(NimbleitDbContext context) : ICategoryRepository
    {
        public async Task<List<Category>> GetAllCategories()
        {
            var categoryEntities = await context.Categories.ToListAsync();
            return categoryEntities;
        }

        public async Task<Category> CreateCategory(Category category)
        {
            context.Categories.Add(category);
            await context.SaveChangesAsync();
            return category;
        }
    }
}
