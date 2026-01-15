/**
 * Rate Plans Grid Component
 *
 * Displays ONLY rate editing (baseRateAdult1, baseRateAdult2).
 * Rate plans are grouped under their respective room types
 * with collapsible accordion headers.
 * 
 * UI/UX ENHANCEMENTS:
 * - Improved visual hierarchy with better spacing and typography
 * - Enhanced selected column visibility with subtle borders
 * - Better hover and focus states for all interactive elements
 * - Clearer separation between room types and rate plans
 * - Premium input styling with improved accessibility
 * - Subtle shadows and transitions for modern polish
 * 
 * LAYOUT FIX:
 * - Fixed horizontal overflow issue on accordion expansion
 * - Consistent grid template across all rows
 * - Proper box-sizing and overflow control
 * - Removed layout-affecting scale transforms
 */

import { useMemo, useState } from 'react';
import {
  addDays,
  format,
  isSameDay,
  startOfToday,
  isBefore,
  isWeekend,
} from 'date-fns';
import { ChevronDown, ChevronRight, User, Users } from 'lucide-react';
import type { RoomType } from '@/types';

/* ----------------------------------
   Dummy Date Metadata (API-like)
----------------------------------- */

type DateMeta = {
  date: string;
  isHoliday: boolean;
  isPeakDay: boolean;
};

const DUMMY_DATE_META: DateMeta[] = [
  { date: '2026-01-15', isHoliday: false, isPeakDay: true },
  { date: '2026-01-23', isHoliday: false, isPeakDay: true },
  { date: '2026-01-29', isHoliday: true, isPeakDay: false },
];

const dateMetaMap = new Map(
  DUMMY_DATE_META.map((d) => [d.date, d])
);

/* ----------------------------------
   Date Helpers
----------------------------------- */

const getDateType = (date: Date) => {
  const key = format(date, 'yyyy-MM-dd');
  const meta = dateMetaMap.get(key);

  if (meta?.isPeakDay) return 'PEAK';
  if (meta?.isHoliday) return 'HOLIDAY';
  if (isWeekend(date)) return 'WEEKEND';
  return 'NORMAL';
};

// UI ENHANCEMENT: Improved header styling with better visual feedback
// LAYOUT FIX: Removed scale() transform that was causing grid width changes
const getHeaderClasses = (
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
        ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
        : 'bg-orange-50 text-orange-700 hover:bg-orange-100 hover:shadow-md';

    case 'HOLIDAY':
      return isSelected
        ? 'bg-red-500 text-white shadow-lg shadow-red-200'
        : 'bg-red-50 text-red-700 hover:bg-red-100 hover:shadow-md';

    case 'WEEKEND':
      return isSelected
        ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-md';

    default:
      return isSelected
        ? 'bg-[#2A3170] text-white shadow-lg shadow-indigo-200'
        : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow-md';
  }
};

// UI ENHANCEMENT: Subtle column highlighting with border emphasis
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

interface RatePlansGridProps {
  rooms: RoomType[];
  baseDate: Date;
  activeDate: Date;
  onUpdate: (
    roomId: string,
    ratePlanId: string,
    dateIndex: number,
    field: 'baseRateAdult1' | 'baseRateAdult2',
    value: number | null
  ) => void;
  onActiveDateChange: (date: Date) => void;
}

export const RatePlansGrid = ({
  rooms,
  baseDate,
  activeDate,
  onUpdate,
  onActiveDateChange,
}: RatePlansGridProps) => {
  const [expandedRoomTypes, setExpandedRoomTypes] = useState<Set<string>>(new Set());

  const dates = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => addDays(baseDate, i)),
    [baseDate]
  );

  const today = startOfToday();

  const toggleRoomType = (roomId: string) => {
    setExpandedRoomTypes((prev) => {
      const next = new Set(prev);
      next.has(roomId) ? next.delete(roomId) : next.add(roomId);
      return next;
    });
  };

  return (
    // LAYOUT FIX: Added overflow-x-hidden to prevent horizontal scroll
    // LAYOUT FIX: Ensured box-sizing is border-box for all children
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white box-border">
      {/* 
        LAYOUT FIX: Consistent grid template used across ALL rows
        This ensures header, room headers, and rate plan rows align perfectly
      */}
      
      {/* Header - UI ENHANCEMENT: Better spacing and typography */}
      <div className="grid grid-cols-[280px_repeat(7,1fr)] bg-gradient-to-b from-gray-50 to-gray-100 border-b-2 border-gray-300">
        <div className="flex items-center px-6 py-5 font-semibold text-sm text-gray-700 border-r border-gray-300 tracking-wide uppercase">
          Rate Plans
        </div>

        {dates.map((date, index) => {
          const isSelected = isSameDay(date, activeDate);
          const isPastDate =
            isBefore(date, today) && !isSameDay(date, today);

          return (
            <button
              key={index}
              disabled={isPastDate}
              onClick={() => !isPastDate && onActiveDateChange(date)}
              // UI ENHANCEMENT: Smooth transitions and better focus states
              // LAYOUT FIX: Removed scale transform that caused width issues
              className={`
                flex flex-col items-center justify-center py-4 px-2 border-r border-gray-200 last:border-r-0
                transition-all duration-200 ease-out outline-none box-border
                focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2A3170] focus-visible:z-10
                ${getHeaderClasses(date, isSelected, isPastDate)}
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

      {/* Room Types */}
      {rooms.map((room, roomIndex) => {
        const isExpanded = expandedRoomTypes.has(room.id);

        return (
          // UI ENHANCEMENT: Added subtle separator between room types
          <div 
            key={room.id} 
            className={`${roomIndex > 0 ? 'border-t-2 border-gray-300' : 'border-t border-gray-200'}`}
          >
            {/* 
              LAYOUT FIX: Room header uses EXACT same grid template as header
              This prevents width misalignment
            */}
            <button
              onClick={() => toggleRoomType(room.id)}
              className="w-full grid grid-cols-[280px_repeat(7,1fr)] bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 transition-all duration-150 group box-border"
            >
              <div className="flex items-center px-6 py-4 font-bold text-base text-gray-800 border-r border-gray-300 box-border">
                {/* UI ENHANCEMENT: Icon animation on expand/collapse */}
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 mr-3 text-gray-600 transition-transform group-hover:translate-y-0.5" />
                ) : (
                  <ChevronRight className="w-5 h-5 mr-3 text-gray-600 transition-transform group-hover:translate-x-0.5" />
                )}
                <span className="group-hover:text-[#2A3170] transition-colors">
                  {room.name}
                </span>
              </div>

              {dates.map((date, i) => (
                <div
                  key={i}
                  // LAYOUT FIX: Added box-border to ensure borders don't add to width
                  className={`min-h-[60px] border-r border-gray-200 transition-colors duration-150 box-border ${
                    isSameDay(date, activeDate)
                      ? getSelectedColumnBg(date)
                      : ''
                  }`}
                />
              ))}
            </button>

            {/* Rate Plans */}
            {isExpanded &&
              room.ratePlans.map((plan, planIndex) => (
                // UI ENHANCEMENT: Better visual separation between rate plans
                <div 
                  key={plan.id} 
                  className={`${planIndex > 0 ? 'border-t-2 border-gray-200' : 'border-t border-gray-200'}`}
                >
                  {/* 
                    LAYOUT FIX: Adult 2 row uses EXACT same grid template
                    All grid children have box-border to prevent overflow
                  */}
                  
                  <div className="grid grid-cols-[280px_repeat(7,1fr)] bg-white hover:bg-gray-50/50 transition-colors duration-150">
                    <div className="flex items-center gap-3 px-6 py-4 border-r border-gray-200 bg-gray-50/80 box-border">
                      <div className="w-1 h-8 bg-blue-400 rounded-full ml-6" />
                      <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-800">
                          {plan.name}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          Adult 2
                        </span>
                      </div>
                    </div>

                    {dates.map((date, i) => {
                      const isSelected = isSameDay(date, activeDate);
                      const value =
                        plan.dailyData[i]?.baseRateAdult2 ?? '';

                      return (
                        <div
                          key={i}
                          // LAYOUT FIX: Added box-border to cell containers
                          className={`p-2 border-r border-gray-200 flex justify-center items-center transition-colors duration-150 box-border ${
                            isSelected ? getSelectedColumnBg(date) : ''
                          }`}
                        >
                          {/* UI ENHANCEMENT: Premium input styling with better focus and hover states */}
                          <input
                            type="number"
                            value={value}
                            readOnly={!isSelected}
                            onChange={(e) =>
                              isSelected &&
                              onUpdate(
                                room.id,
                                plan.id,
                                i,
                                'baseRateAdult2',
                                e.target.value === ''
                                  ? null
                                  : Number(e.target.value)
                              )
                            }
                            // LAYOUT FIX: Ensured input has box-border
                            className={`
                              w-24 px-3 py-2 text-sm font-semibold border-2 rounded-md text-center
                              transition-all duration-150 box-border
                              ${
                                isSelected
                                  ? 'bg-white border-gray-300 hover:border-[#2A3170] focus:outline-none focus:ring-2 focus:ring-[#2A3170] focus:ring-offset-1 shadow-sm hover:shadow-md'
                                  : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50 text-gray-500'
                              }
                            `}
                            placeholder={isSelected ? '0' : '—'}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* 
                    LAYOUT FIX: Adult 1 row uses EXACT same grid template
                    Maintaining consistency across all grid rows
                  */}
                  <div className="grid grid-cols-[280px_repeat(7,1fr)] border-t border-gray-200 bg-white hover:bg-gray-50/50 transition-colors duration-150">
                    <div className="flex items-center gap-3 px-6 py-4 border-r border-gray-200 bg-gray-50/80 box-border">
                      <div className="w-1 h-8 bg-green-400 rounded-full ml-6" />
                      <User className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-800">
                          {plan.name}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          Adult 1
                        </span>
                      </div>
                    </div>

                    {dates.map((date, i) => {
                      const isSelected = isSameDay(date, activeDate);
                      const value =
                        plan.dailyData[i]?.baseRateAdult1 ?? '';

                      return (
                        <div
                          key={i}
                          // LAYOUT FIX: Added box-border to cell containers
                          className={`p-2 border-r border-gray-200 flex justify-center items-center transition-colors duration-150 box-border ${
                            isSelected ? getSelectedColumnBg(date) : ''
                          }`}
                        >
                          {/* UI ENHANCEMENT: Matching premium input styling */}
                          <input
                            type="number"
                            value={value}
                            readOnly={!isSelected}
                            onChange={(e) =>
                              isSelected &&
                              onUpdate(
                                room.id,
                                plan.id,
                                i,
                                'baseRateAdult1',
                                e.target.value === ''
                                  ? null
                                  : Number(e.target.value)
                              )
                            }
                            // LAYOUT FIX: Ensured input has box-border
                            className={`
                              w-24 px-3 py-2 text-sm font-semibold border-2 rounded-md text-center
                              transition-all duration-150 box-border
                              ${
                                isSelected
                                  ? 'bg-white border-gray-300 hover:border-[#2A3170] focus:outline-none focus:ring-2 focus:ring-[#2A3170] focus:ring-offset-1 shadow-sm hover:shadow-md'
                                  : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50 text-gray-500'
                              }
                            `}
                            placeholder={isSelected ? '0' : '—'}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
};