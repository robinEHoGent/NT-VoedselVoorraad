using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Api.Contracts.unitOfMeasurementContracts;
using Nimble_It.Domain.Models;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Domain.Services.mappers
{
    public static class UnitOfMeasurementsMapper
    {
        public static UnitOfMeasurementModel ToModel(this UnitsOfMeasurement unitEntity)
        {
            return new UnitOfMeasurementModel
            {
                Id = unitEntity.Id,
                Name = unitEntity.Name,
            };
        }

        public static UnitOfMeasurementResponseContract ToContract(this UnitOfMeasurementModel unitModel)
        {
            return new UnitOfMeasurementResponseContract
            {
                Id = unitModel.Id,
                Unit = unitModel.Name,
            };
        }
    }
}