using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Nimble_It.Api.Contracts.productsContracts;
using Nimble_It.Domain.Models;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Domain.Services.mappers
{
    public static class ProductMapper
    {
        public static ProductModel ToModelNoCategory(this Product? entity)
        {
            if (entity is null || entity.Uom is null)
                throw new NullReferenceException("");

            return new ProductModel
            {
                Id = entity.Id,
                Name = entity.Name,
                UOMName = entity.Uom.Name,
                ImageUrl = entity.ImageUrl, // task 216
            };
        }

        public static ProductResponseContract ToContractProduct(this ProductModel? entity)
        {
            if (entity is null)
                throw new NullReferenceException("");

            return new ProductResponseContract
            {
                ProductId = entity.Id,
                ProductName = entity.Name,
                UomName = entity.UOMName!,
                ImageUrl = entity.ImageUrl, // task 216
            };
        }
    }
}
