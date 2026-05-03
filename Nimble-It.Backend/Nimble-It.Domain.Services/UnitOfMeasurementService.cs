using Nimble_It.Api.Contracts.unitOfMeasurementContracts;
using Nimble_It.Domain.Services.interfaces;
using Nimble_It.Domain.Services.mappers;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Domain.Services
{
    // Nieuwe service: handelt UoM creatie apart af ipv nested in inventory request
    public class UnitOfMeasurementService(IUnitOfMeasurementRepository repository)
        : IUnitOfMeasurementService
    {
        public async Task<UnitOfMeasurementResponseContract> CreateUnitOfMeasurement(
            UnitOfMeasurementRequestContract request
        )
        {
            if (string.IsNullOrWhiteSpace(request.Unit))
                throw new ArgumentException("Unit name is required");

            var uom = new UnitsOfMeasurement { Name = request.Unit };

            var created = await repository.CreateUnitOfMeasurement(uom);

            return new UnitOfMeasurementResponseContract { Id = created.Id, Unit = created.Name };
        }

        public async Task<List<UnitOfMeasurementResponseContract>> GetAllUnits()
        {
            var unitEntities = await repository.GetAllUnits();
            return unitEntities.Select(c => c.ToModel().ToContract()).ToList();
        }

        public async Task<List<UnitOfMeasurementResponseContract>> GetAllUnitsSimple()
        {
            var unitEntities = await repository.GetAllUnits();
            return unitEntities
                .Select(u => new UnitOfMeasurementResponseContract { Id = u.Id, Unit = u.Name })
                .ToList();
        }
    }
}
