using Nimble_It.Api.Contracts.shoppinglistContracts;
using Nimble_It.Domain.Models;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Domain.Services.mappers
{
    public static class ShoppingListMapper
    {
        public static ShoppingListModel ToModel(this ShoppingList entity)
        {
            return new ShoppingListModel
            {
                Id = entity.Id,
                Amount = entity.Amount,
                Product = entity.Product.ToModelNoCategory(),
            };
        }

        public static ShoppingListItemResponseContract ToContract(this ShoppingListModel model)
        {
            var itemContract = new ShoppingListItemResponseContract()
            {
                Id = model.Id,
                Product = model.Product.ToContract(),
                Amount = model.Amount,
            };

            return itemContract;
        }

        public static ShoppingListItemProductResponseContract ToContract(this ProductModel model)
        {
            var itemProductContract = new ShoppingListItemProductResponseContract()
            {
                ProductId = model.Id,
                ProductName = model.Name,
                UomName = model.UOMName,
            };

            return itemProductContract;
        }

        public static ShoppingListModel ToModel(
            this ShoppingListItemRequestContract requestContract
        )
        {
            // TODO verder aanvullen eens product verder is uitgewerkt
            var product = new ProductModel { Id = requestContract.ProductId };
            return new ShoppingListModel { Product = product, Amount = requestContract.Amount };
        }

        public static ShoppingList ToEntity(this ShoppingListModel model)
        {
            return new ShoppingList
            {
                Id = model.Id,
                Amount = model.Amount,
                ProductId = model.Product.Id,
                // Product = model.Product.ToEntity(),
            };
        }

        public static Product ToEntity(this ProductModel model)
        {
            // TODO verder aanvullen eens product verder is uitgewerkt
            return new Product { Id = model.Id, Name = model.Name };
        }

        public static ShoppingListResponseContract ToResponseContract(
            this List<ShoppingListModel> modelList
        )
        {
            var shoppingListItemResponseContractList = new List<ShoppingListItemResponseContract>();

            // TODO verder aanvullen eens product verder is uitgewerkt

            foreach (var modelItem in modelList)
            {
                var item = new ShoppingListItemResponseContract()
                {
                    Id = modelItem.Id,

                    Product = modelItem.Product.ToContract(),
                    Amount = modelItem.Amount,
                };

                shoppingListItemResponseContractList.Add(item);
            }

            return new ShoppingListResponseContract
            {
                ShoppingListItems = shoppingListItemResponseContractList,
            };
        }
    }
}
