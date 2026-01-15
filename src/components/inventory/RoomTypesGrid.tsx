/**
 * Room Types Grid Component
 *
 * Displays ONLY availability editing (inventory fields).
 * Rate editing is disabled in this view.
 * 
 * UI/UX ENHANCEMENTS:
 * - Matched premium styling from RatePlansGrid
 * - Improved visual hierarchy and spacing
 * - Enhanced selected column visibility
 * - Better hover and focus states
 * - Clearer inventory status indicators
 * - Premium input styling with improved accessibility
 */

import { useMemo } from 'react';
import {
  addDays,
  format,
  isSameDay,
  startOfToday,
  isBefore,
  isWeekend,
} from 'date-fns';
import type { RoomType } from '@/types';

/* ----------------------------------
   Dummy Date Metadata (API-like)
----------------------------------- */

type DateMeta = {
  date: string; // yyyy-MM-dd
  isHoliday: boolean;
  isPeakDay: boolean;
};

const DUMMY_DATE_META: DateMeta[] = [
  { date: '2026-01-15', isHoliday: false, isPeakDay: true }, // Sat peak
  { date: '2026-01-23', isHoliday: false, isPeakDay: true }, // Sun peak
  { date: '2026-01-29', isHoliday: true,  isPeakDay: false }, // Holiday
];

const dateMetaMap = new Map(
  DUMMY_DATE_META.map((d) => [d.date, d])
);

/* ----------------------------------
   Date Type Helper
----------------------------------- */

const getDateType = (date: Date) => {
  const key = format(date, 'yyyy-MM-dd');
  const meta = dateMetaMap.get(key);

  if (meta?.isPeakDay) return 'PEAK';
  if (meta?.isHoliday) return 'HOLIDAY';
  if (isWeekend(date)) return 'WEEKEND';
  return 'NORMAL';
};

/* ----------------------------------
   Header Styling Resolver
----------------------------------- */

// UI ENHANCEMENT: Improved header styling matching RatePlansGrid
const getDateHeaderClasses = (
  date: Date,
  isSelected: boolean,
  isPastDate: boolean
) => {
  if (isPastDate) {
    return 'bg-gray-50 text-gray-300 cursor-not-allowed opacity-60';
  }

  const type = getDateType(date);

  switch (type) {
    case 'PEAK':
      return isSelected
        ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-[1.02]'
        : 'bg-orange-50 text-orange-700 hover:bg-orange-100 hover:shadow-md';

    case 'HOLIDAY':
      return isSelected
        ? 'bg-red-500 text-white shadow-lg shadow-red-200 scale-[1.02]'
        : 'bg-red-50 text-red-700 hover:bg-red-100 hover:shadow-md';

    case 'WEEKEND':
      return isSelected
        ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 scale-[1.02]'
        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-md';

    default:
      return isSelected
        ? 'bg-[#2A3170] text-white shadow-lg shadow-indigo-200 scale-[1.02]'
        : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow-md';
  }
};

// UI ENHANCEMENT: Subtle column highlighting matching RatePlansGrid
const getSelectedColumnBg = (date: Date) => {
  const type = getDateType(date);

  switch (type) {
    case 'PEAK':
      return 'bg-orange-50/50 border-l-2 border-r-2 border-orange-300';

    case 'HOLIDAY':
      return 'bg-red-50/50 border-l-2 border-r-2 border-red-300';

    case 'WEEKEND':
      return 'bg-blue-50/50 border-l-2 border-r-2 border-blue-300';

    default:
      return 'bg-indigo-50/50 border-l-2 border-r-2 border-indigo-300';
  }
};

/* ----------------------------------
   Component
----------------------------------- */

interface RoomTypesGridProps {
  rooms: RoomType[];
  baseDate: Date;
  activeDate: Date;
  onUpdate: (roomId: string, dateIndex: number, value: number) => void;
  onActiveDateChange: (date: Date) => void;
}

export const RoomTypesGrid = ({
  rooms,
  baseDate,
  activeDate,
  onUpdate,
  onActiveDateChange,
}: RoomTypesGridProps) => {
  const dates = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(baseDate, i));
  }, [baseDate]);

  const today = startOfToday();

  return (
    // UI ENHANCEMENT: Added shadow and improved border styling matching RatePlansGrid
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
      {/* Header Row - UI ENHANCEMENT: Better spacing and typography */}
      <div className="grid grid-cols-[280px_repeat(7,1fr)] bg-gradient-to-b from-gray-50 to-gray-100 border-b-2 border-gray-300">
        <div className="flex items-center px-6 py-5 font-semibold text-sm text-gray-700 border-r border-gray-300 tracking-wide uppercase">
          Room Types
        </div>

        {dates.map((date, index) => {
          const isSelected = isSameDay(date, activeDate);
          const isPastDate =
            isBefore(date, today) && !isSameDay(date, today);

          return (
            <button
              key={index}
              onClick={() => {
                if (!isPastDate) {
                  onActiveDateChange(date);
                }
              }}
              disabled={isPastDate}
              // UI ENHANCEMENT: Smooth transitions and better focus states
              className={`
                flex flex-col items-center justify-center py-4 px-2 border-r border-gray-200 last:border-r-0
                transition-all duration-200 ease-out outline-none
                focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2A3170] focus-visible:z-10
                ${getDateHeaderClasses(date, isSelected, isPastDate)}
                ${isSelected ? 'relative z-10' : ''}
              `}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider mb-1">
                {format(date, 'EEE')}
              </span>
              <span className="text-2xl font-bold mb-1">
                {format(date, 'd')}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {format(date, 'MMM')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Room Rows */}
      {rooms.map((room, roomIndex) => {
        const inventoryData = room.ratePlans[0]?.dailyData || [];

        return (
          <div
            key={room.id}
            // UI ENHANCEMENT: Better visual separation between room types
            className={`grid grid-cols-[280px_repeat(7,1fr)] ${
              roomIndex > 0 ? 'border-t-2 border-gray-300' : 'border-t border-gray-200'
            } bg-white hover:bg-gray-50/30 transition-colors duration-150`}
          >
            {/* UI ENHANCEMENT: Improved room name styling with better spacing */}
            <div className="flex items-center px-6 py-5 font-bold text-base text-gray-800 border-r border-gray-300 bg-gradient-to-r from-gray-100 to-gray-50">
              {room.name}
            </div>

            {dates.map((date, dateIndex) => {
              const dailyData = inventoryData[dateIndex];
              const isColumnSelected = isSameDay(date, activeDate);
              const inventoryValue = dailyData?.inventory || 0;
              const hasInventory = inventoryValue > 0;

              return (
                <div
                  key={dateIndex}
                  className={`
                    border-r border-gray-200 last:border-r-0 p-4 flex flex-col items-center justify-center min-h-[100px]
                    transition-all duration-150
                    ${isColumnSelected ? getSelectedColumnBg(date) : ''}
                  `}
                >
                  {/* UI ENHANCEMENT: Premium input styling with improved visual feedback */}
                  <input
                    type="number"
                    value={inventoryValue}
                    readOnly={!isColumnSelected}
                    onChange={(e) => {
                      if (isColumnSelected) {
                        const value = Math.max(
                          0,
                          Number(e.target.value) || 0
                        );
                        onUpdate(room.id, dateIndex, value);
                      }
                    }}
                    className={`
                      w-20 h-12 border-2 rounded-md font-bold text-xl text-center
                      transition-all duration-150
                      ${
                        isColumnSelected
                          ? 'focus:outline-none focus:ring-2 focus:ring-[#2A3170] focus:ring-offset-1 shadow-sm hover:shadow-md'
                          : 'cursor-not-allowed opacity-50'
                      }
                      ${
                        hasInventory
                          ? 'border-green-400 text-green-700 bg-green-50 hover:border-green-500'
                          : 'border-red-400 text-red-700 bg-red-50 hover:border-red-500'
                      }
                    `}
                  />
                  {/* UI ENHANCEMENT: Improved status label styling */}
                  <span className={`
                    text-[11px] font-semibold uppercase mt-2.5 tracking-wide
                    ${hasInventory ? 'text-green-600' : 'text-red-600'}
                  `}>
                    {hasInventory
                      ? `${inventoryValue} Available`
                      : 'Sold Out'}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};