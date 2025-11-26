// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.poolMember.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.bankEntry.deleteMany();
  await prisma.shipCompliance.deleteMany();
  await prisma.route.deleteMany();

  // Create routes with mixed GHG intensities to generate different CBs
  // TARGET = 89.3368 gCO₂e/MJ
  await prisma.route.createMany({
    data: [
      // Above target = negative CB (deficit)
      {
        routeId: 'R001',
        vesselType: 'Container',
        fuelType: 'HFO',
        year: 2024,
        ghgIntensity: 95.0, // High = deficit
        fuelConsumption: 5000,
        distance: 12000,
        totalEmissions: 4500,
        isBaseline: true
      },
      // Slightly above target = small deficit
      {
        routeId: 'R002',
        vesselType: 'BulkCarrier',
        fuelType: 'LNG',
        year: 2024,
        ghgIntensity: 92.0, // Medium = small deficit
        fuelConsumption: 4800,
        distance: 11500,
        totalEmissions: 4200,
        isBaseline: false
      },
      // Below target = positive CB (surplus)
      {
        routeId: 'R003',
        vesselType: 'Tanker',
        fuelType: 'MGO',
        year: 2024,
        ghgIntensity: 85.0, // Low = surplus
        fuelConsumption: 5100,
        distance: 12500,
        totalEmissions: 4700,
        isBaseline: false
      },
      // Well below target = large surplus
      {
        routeId: 'R004',
        vesselType: 'RoRo',
        fuelType: 'HFO',
        year: 2024,
        ghgIntensity: 80.0, // Very low = large surplus
        fuelConsumption: 4900,
        distance: 11800,
        totalEmissions: 4300,
        isBaseline: false
      },
      // Near target = small surplus
      {
        routeId: 'R005',
        vesselType: 'Container',
        fuelType: 'LNG',
        year: 2024,
        ghgIntensity: 88.0, // Near target = small surplus
        fuelConsumption: 4950,
        distance: 11900,
        totalEmissions: 4400,
        isBaseline: false
      }
    ]
  });

  console.log('Database seeded with mixed CB scenarios');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });