using Nimble_It.Persistence.Entities;

namespace Nimble_It.Persistence.interfaces {
    public interface IShoppingListRepository {
        Task<ShoppingList?> GetShoppingListItem(int shoppinglistItemId);
        Task<List<ShoppingList>> GetAllShoppingListItems();
        Task<ShoppingList> CreateShoppingListItem(ShoppingList shoppingListItemEntity);
        Task<ShoppingList> UpdateShoppingListItem(ShoppingList shoppingListItemEntity);
        Task<bool> DeleteShoppingListItem(int shoppingListItemId);
    }
}
