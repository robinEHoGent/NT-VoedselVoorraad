using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.TagContracts;
using Nimble_It.Domain.Models;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Domain.Services.mappers
{
    public static class TagMapper
    {
        public static TagModel ToModel(this Tag entity)
        {
            return new TagModel { Id = entity.Id, Name = entity.Name };
        }

        public static TagResponseContract ToContract(this TagModel model)
        {
            return new TagResponseContract { Id = model.Id, Name = model.Name };
        }

        public static Tag ToEntity(this TagRequestContract contract)
        {
            return new Tag { Name = contract.Name };
        }
    }
}
