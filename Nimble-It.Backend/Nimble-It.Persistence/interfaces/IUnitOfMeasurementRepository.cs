using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nimble_It.Persistence.Entities;

namespace Nimble_It.Persistence.interfaces
{
    public interface IUnitOfMeasurementRepository
    {
        Task<List<UnitsOfMeasurement>> GetAllUnits();
        Task<UnitsOfMeasurement> CreateUnitOfMeasurement(UnitsOfMeasurement unitsOfMeasurement);
    }
}