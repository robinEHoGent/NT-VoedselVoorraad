using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Nimble_It.Api.Contracts.InstructionContracts;
using Nimble_It.Api.Contracts.productsContracts;
using Nimble_It.Api.Contracts.recipesContracts;
using Nimble_It.Api.Contracts.TagContracts;
using Nimble_It.Domain.Models;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Domain.Services.mappers
{
    public static class RecipeMapper
    {
        public static RecipeModel ToModel(this RecipeRequestContract contract)
        {
            return new RecipeModel
            {
                Name = contract.Name,
                Description = contract.Description,
                PrepareTime = contract.PrepareTime,
                Complexity = contract.Complexity,
                ServingSize = contract.ServingSize,
                TagIds = contract.Tags,
                RecipeParts = contract.RecipeParts,
                InstructionRequests = contract.Instructions,
            };
        }

        public static RecipeResponseContract ToContract(this RecipeModel model)
        {
            return new RecipeResponseContract
            {
                RecipeId = model.Id,
                Name = model.Name,
                Description = model.Description,
                Image = model.Image,
                Cookable = model.Cookable,
            };
        }

        public static RecipeModel ToModel(this Recipe entity)
        {
            return new RecipeModel
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                Image = entity.ImageUrl,
            };
        }

        public static RecipeModel ToFullModel(this Recipe entity)
        {
            return new RecipeModel
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                PrepareTime = entity.PrepareTime,
                Image = entity.ImageUrl,
                CreatedOn = entity.CreatedOn,
                Favorite = entity.Favorite,
                LastCooked = entity.LastCooked,
                Complexity = entity.Complexity,
                ServingSize = entity.ServingSize,
                RecipeInfos = [.. entity.RecipeInfos.Select(ri => ri.ToModel())],
                RecipeTags = [.. entity.RecipeTags.Select(rt => rt.Tag!.ToModel())],
                Instructions = [.. entity.Instructions.Select(i => i.ToModel())],
            };
        }

        public static FullRecipeResponseContract ToFullContract(this RecipeModel model)
        {
            return new FullRecipeResponseContract
            {
                RecipeId = model.Id,
                Name = model.Name,
                Description = model.Description,
                PrepareTime = model.PrepareTime,
                Image = model.Image,
                CreatedOn = model.CreatedOn.ToString("dd/MM/yyyy"),
                Favorite = model.Favorite,
                LastCooked = model.LastCooked?.ToString("dd/MM/yyyy"),
                Complexity = model.Complexity,
                ServingSize = model.ServingSize,
                Parts =
                [
                    .. model
                        .RecipeInfos.GroupBy(ri => ri.Part)
                        .Select(g =>
                        {
                            var contract = g.First().ToContract();
                            var products = g.Select(h =>
                            {
                                var product = h.Product!.ToProductcontract();
                                product.Amount = (decimal)h.Amount!;
                                contract.PartId = (int)h.Part!;
                                return product;
                            });
                            contract.Products = [];
                            foreach (RecipeProductResponseContract product in products)
                            {
                                contract.Products.Add(product);
                            }
                            return contract;
                        }),
                ],
                Tags = [.. model.RecipeTags.Select(rt => rt.ToContract())],
                Instructions = [.. model.Instructions.Select(i => i.ToContract())],
            };
        }

        public static RecipeModel ToModel(this Recipe entity, bool cookable)
        {
            return new RecipeModel
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                Image = entity.ImageUrl,
                Cookable = cookable,
            };
        }

        public static RecipeProductResponseContract ToProductcontract(this ProductModel model)
        {
            return new RecipeProductResponseContract
            {
                ProductId = model.Id,
                ProductName = model.Name!,
                UomName = model.UOMName!,
                ImageUrl = model.ImageUrl,
            };
        }

        public static RecipePartResponseContract ToContract(this RecipeInfoModel model)
        {
            return new RecipePartResponseContract { Title = model.Title! };
        }

        public static RecipeInfoModel ToModel(this RecipeInfo entity)
        {
            return new RecipeInfoModel
            {
                Id = entity.Id,
                Product = entity.Product.ToModel(),
                Amount = entity.Amount,
                Part = entity.Part,
                Title = entity.Title,
            };
        }

        public static InstructionModel ToModel(this Instruction entity)
        {
            return new InstructionModel
            {
                Id = entity.Id,
                Step = entity.Step,
                Header = entity.Header,
                Text = entity.Text,
            };
        }

        public static InstructionResponseContract ToContract(this InstructionModel model)
        {
            return new InstructionResponseContract
            {
                Id = model.Id,
                Step = model.Step,
                Header = model.Header,
                Text = model.Text,
            };
        }

        public static Recipe ToEntity(this RecipeModel model)
        {
            return new Recipe
            {
                Id = model.Id,
                Name = model.Name,
                Description = model.Description,
                PrepareTime = model.PrepareTime,
                Complexity = model.Complexity,
                ServingSize = model.ServingSize,
                CreatedOn = DateTime.UtcNow,
                Favorite = false,
                ImageUrl = model.Image,
            };
        }
    }
}
