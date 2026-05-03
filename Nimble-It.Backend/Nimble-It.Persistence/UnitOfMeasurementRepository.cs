using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Nimble_It.Persistence.Entities;
using Nimble_It.Persistence.interfaces;

namespace Nimble_It.Persistence
{
    public class UnitOfMeasurementRepository(NimbleitDbContext context) : IUnitOfMeasurementRepository
    {
        public async Task<UnitsOfMeasurement> CreateUnitOfMeasurement(UnitsOfMeasurement unit)
        {
            context.UnitsOfMeasurements.Add(unit);
            await context.SaveChangesAsync();
            return unit;
        }

        public async Task<List<UnitsOfMeasurement>> GetAllUnits()
        {
            var unitEntities = await context.UnitsOfMeasurements.ToListAsync();
            return unitEntities;
        }
    }
}