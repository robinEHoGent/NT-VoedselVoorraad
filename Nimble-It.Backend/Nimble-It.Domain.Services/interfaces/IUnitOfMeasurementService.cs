using Nimble_It.Api.Contracts.unitOfMeasurementContracts;

namespace Nimble_It.Domain.Services.interfaces
{
    // Interface voor gesplitste UoM creatie endpoint (zie txtfile "testinventoryscenarios")
    public interface IUnitOfMeasurementService
    {
        Task<UnitOfMeasurementResponseContract> CreateUnitOfMeasurement(
            UnitOfMeasurementRequestContract request
        );
        Task<List<UnitOfMeasurementResponseContract>> GetAllUnits();
        Task<List<UnitOfMeasurementResponseContract>> GetAllUnitsSimple();
    }
}
