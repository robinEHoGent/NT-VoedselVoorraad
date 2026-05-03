using Microsoft.EntityFrameworkCore;
using Nimble_It.Persistence;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Persistence
{
    public class ShoppingListRepository(NimbleitDbContext context) : IShoppingListRepository
    {
        public async Task<List<ShoppingList>> GetAllShoppingListItems()
        {
            return await context
                .ShoppingLists.Include(i => i.Product!)
                .ThenInclude(i => i.Uom)
                .ToListAsync();
        }

        public async Task<ShoppingList?> GetShoppingListItem(int shoppinglistItemId)
        {
            return await context
                .ShoppingLists.Include(i => i.Product!)
                .ThenInclude(i => i.Uom)
                .FirstOrDefaultAsync(s => s.Id == shoppinglistItemId);
        }

        public async Task<ShoppingList> CreateShoppingListItem(ShoppingList shoppingListItemEntity)
        {
            var product = await context.Products.FirstOrDefaultAsync(product =>
                product.Id == shoppingListItemEntity.ProductId
            );

            var uom = await context.UnitsOfMeasurements.FirstOrDefaultAsync(unit =>
                unit.Id == product.UomId
            );

            product.Uom = uom;

            shoppingListItemEntity.Product =
                product ?? throw new NullReferenceException("Product id not found");

            await context.ShoppingLists.AddAsync(shoppingListItemEntity);
            await context.SaveChangesAsync();
            return shoppingListItemEntity;
        }

        public async Task<ShoppingList> UpdateShoppingListItem(ShoppingList shoppingListItemEntity)
        {
            var existingShoppingListItem = await GetShoppingListItem(shoppingListItemEntity.Id);

            if (existingShoppingListItem is null)
                throw new Exception("Shoppinglist item not found"); // TODO ShoppingListException van maken?

            if (shoppingListItemEntity.ProductId != existingShoppingListItem.ProductId)
                throw new Exception("product id does not match product to change id");

            existingShoppingListItem.Amount = shoppingListItemEntity.Amount;

            await context.SaveChangesAsync();

            return existingShoppingListItem;
        }

        public async Task<bool> DeleteShoppingListItem(int shoppingListItemId)
        {
            var existingShoppingListItem = await GetShoppingListItem(shoppingListItemId);

            if (existingShoppingListItem is null)
                throw new Exception("Shoppinglist item not found"); // TODO ShoppingListException van maken?

            context.ShoppingLists.Remove(existingShoppingListItem);
            await context.SaveChangesAsync();

            return true;
        }
    }
}
