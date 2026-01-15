import { startOfToday, addDays } from 'date-fns';
import type { RoomType, TabOption } from '@/types';



// Navigation tabs
export const TAB_OPTIONS: TabOption[] = [
  { id: 'b2c', label: 'B2C' },
  { id: 'mybiz', label: 'MYBIZ' },
  { id: 'b2b', label: 'B2B' },
];

// Generate initial daily data for 7 days
const generateDailyData = (startDate: Date = startOfToday()) => {
  return Array.from({ length: 7 }).map((_, i) => ({
    date: addDays(startDate, i),
    inventory: i === 0 ? 2 : 100, // First day has low inventory for demo
    baseRateAdult2: i < 4 ? 740 + (i * 10) : null, // Some dates missing rates
    baseRateAdult1: i < 4 ? 650 + (i * 10) : null,
  }));
};


// Initial room types with rate plans
export const INITIAL_ROOM_DATA: RoomType[] = [
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    ratePlans: [
      {
        id: 'ep',
        name: 'EP',
        dailyData: generateDailyData(),
      },
      {
        id: 'map',
        name: 'MAP',
        dailyData: generateDailyData(),
      },
      {
        id: 'cp',
        name: 'CP',
        dailyData: generateDailyData(),
      },
    ],
  },
  
  {
    id: 'suite',
    name: 'Suite Room',
    ratePlans: [
      {
        id: 'ep',
        name: 'EP',
        dailyData: generateDailyData(),
      },
      {
        id: 'map',
        name: 'MAP',
        dailyData: generateDailyData(),
      },
    ],
  },
];

