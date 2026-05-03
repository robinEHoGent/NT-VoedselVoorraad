namespace Nimble_It.Api.Contracts.unitOfMeasurementContracts;

// Response contract voor gesplitste UoM creatie endpoint (POST /api/unitsofmeasurement)
public class UnitOfMeasurementResponseContract
{
    public int Id { get; set; }
    public string Unit { get; set; } = string.Empty;
}
