using Nimble_It.Api.Contracts.shoppinglistContracts;

namespace Nimble_It.Domain.Services.interfaces {
    public interface IShoppingListService {
        Task<ShoppingListResponseContract> GetShoppingListItems();
        Task<ShoppingListItemResponseContract> GetShoppingListItem(int shoppinglistItemId);
        Task<ShoppingListItemResponseContract> CreateShoppingListItem(ShoppingListItemRequestContract shoppingListItemRequestContract);
        Task<ShoppingListItemResponseContract?> UpdateShoppinglistItem(ShoppingListItemRequestContract shoppingListItemRequestContract, int shoppingListItemRequestContractId);
        Task<bool> RemoveShoppingListItem(int shoppingListItemRequestContractId);
    }
}
