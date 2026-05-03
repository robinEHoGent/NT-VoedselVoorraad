using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.categoriesContracts;
using Nimble_It.Domain.Models;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Domain.Services.mappers
{
    public static class CategoryMapper
    {
        public static CategoryModel ToModel(this Category categoryEntity)
        {
            return new CategoryModel
            {
                Id = categoryEntity.Id,
                Name = categoryEntity.Name,
                NotificationTime = categoryEntity.NotificationTime
            };
        }

        public static CategoryItemResponseContract ToContract(this CategoryModel categoryModel)
        {
            return new CategoryItemResponseContract
            {
                CategoryId = categoryModel.Id,
                CategoryName = categoryModel.Name,
                NotificationTime = categoryModel.NotificationTime
            };
        }
    }
}
