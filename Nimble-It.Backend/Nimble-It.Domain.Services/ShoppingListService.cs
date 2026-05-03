using Nimble_It.Api.Contracts.shoppinglistContracts;
using Nimble_It.Domain.Services.interfaces;
using Nimble_It.Domain.Services.mappers;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Domain.Services
{
    public class ShoppingListService(IShoppingListRepository shoppingListRepository)
        : IShoppingListService
    {
        public async Task<ShoppingListResponseContract> GetShoppingListItems()
        {
            var shoppinglistEntities = await shoppingListRepository.GetAllShoppingListItems();
            var shoppinglistModels = shoppinglistEntities.Select(s => s.ToModel()).ToList();
            var shoppinglistResponseContract = shoppinglistModels.ToResponseContract();

            return shoppinglistResponseContract;
        }

        public async Task<ShoppingListItemResponseContract?> GetShoppingListItem(
            int shoppinglistItemId
        )
        {
            var shoppinglistEntity = await shoppingListRepository.GetShoppingListItem(
                shoppinglistItemId
            );
            var shoppinglistModel = shoppinglistEntity?.ToModel();
            var shoppinglistItemResponseContract = shoppinglistModel?.ToContract();

            return shoppinglistItemResponseContract;
        }

        public async Task<ShoppingListItemResponseContract> CreateShoppingListItem(
            ShoppingListItemRequestContract shoppingListItemRequestContract
        )
        {
            var shoppingListItemModel = shoppingListItemRequestContract.ToModel();
            var shoppingListItemEntity = shoppingListItemModel.ToEntity();
            var createdshoppingListItemEntity = await shoppingListRepository.CreateShoppingListItem(
                shoppingListItemEntity
            );

            return createdshoppingListItemEntity.ToModel().ToContract();
        }

        public async Task<ShoppingListItemResponseContract?> UpdateShoppinglistItem(
            ShoppingListItemRequestContract shoppingListItemRequestContract,
            int shoppingListItemRequestContractId
        )
        {
            var shoppingListItemModel = shoppingListItemRequestContract.ToModel();
            shoppingListItemModel.Id = shoppingListItemRequestContractId;

            try
            {
                var updatedshoppingListEntity = await shoppingListRepository.UpdateShoppingListItem(
                    shoppingListItemModel.ToEntity()
                );
                return updatedshoppingListEntity.ToModel().ToContract();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<bool> RemoveShoppingListItem(int shoppingListItemRequestContractId)
        {
            try {
                return await shoppingListRepository.DeleteShoppingListItem(shoppingListItemRequestContractId);
            }
            catch (Exception) {

                throw;
            }            
        }
    }
}
