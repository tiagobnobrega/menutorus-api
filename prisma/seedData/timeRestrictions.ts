import { PrismaClient } from '@prisma/client';
type Params = Parameters<PrismaClient['timeRestriction']['create']>[0]['data'];

const timeRestrictionsData:Params[] = [{
  code: 'SEG_SEX_EXECUTIVO_12_16',
  times: {
    create: [1, 2, 3, 4, 5].map((weekDay) => ({
      weekDay,
      excludeHolidays: true,
      startTime: '12:00',
      endTime: '16:00',
    })),
  },
},
{
  code: 'HAPPY_HOUR_17_20',
  times: {
    create: [0, 1, 2, 3, 4, 5, 6].map((weekDay) => ({
      weekDay,
      excludeHolidays: true,
      startTime: '17:00',
      endTime: '20:00',
    })),
  },
}];

export default timeRestrictionsData;
