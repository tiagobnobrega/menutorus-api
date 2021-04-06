import { PrismaClient } from '@prisma/client';
import langs from './seedData/langs';
import seedSample from './seedData/sampleBusiness';
import timeRestrictions from './seedData/timeRestrictions';

const prisma = new PrismaClient();

async function main() {
  const langsPromises = langs.map((l) => prisma.lang.upsert({
    where: { id: l.id },
    update: {},
    create: l,
  }));
  await Promise.all(langsPromises);

  const timeRestrictionPromises = timeRestrictions.map((tr) => prisma.timeRestriction.upsert({
    where: { code: tr.code },
    update: {},
    create: tr,
  }));
  await Promise.all(timeRestrictionPromises);

  await seedSample(prisma);
}

main()
  .catch((error) => {
    console.error(error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
