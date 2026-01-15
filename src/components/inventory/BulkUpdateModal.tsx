import { useState, useEffect } from 'react';
import { format, startOfToday, addDays, isBefore, isSameDay } from 'date-fns';
import { X, Calendar as CalendarIcon } from 'lucide-react';

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: Date, endDate: Date, value: number | null, field?: 'baseRateAdult1' | 'baseRateAdult2') => void;
  section: 'room-types' | 'rate-plans';
}

export const BulkUpdateModal = ({
  isOpen,
  onClose,
  onApply,
  section,
}: BulkUpdateModalProps) => {
  const today = startOfToday();
  const defaultEndDate = addDays(today, 6); // Upcoming 7 days (today + 6 days)

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [value, setValue] = useState<string>('');
  const [selectedField, setSelectedField] = useState<'baseRateAdult1' | 'baseRateAdult2'>('baseRateAdult1');

  // Reset to default when modal opens
  useEffect(() => {
    if (isOpen) {
      setStartDate(today);
      setEndDate(defaultEndDate);
      setValue('');
      setSelectedField('baseRateAdult1');
    }
  }, [isOpen, today, defaultEndDate]);

  if (!isOpen) return null;

  const handleStartDateChange = (date: Date) => {
    // Only allow if the date is today or in the future
    if (!isBefore(date, today) || isSameDay(date, today)) {
      setStartDate(date);
      // If start date is after end date, adjust end date
      if (isBefore(endDate, date) && !isSameDay(endDate, date)) {
        setEndDate(date);
      }
    }
  };

  const handleEndDateChange = (date: Date) => {
    // Only allow if the date is today or in the future
    if (!isBefore(date, today) || isSameDay(date, today)) {
      // Ensure end date is not before start date
      if (!isBefore(date, startDate) || isSameDay(date, startDate)) {
        setEndDate(date);
      }
    }
  };

  const handleApply = () => {
    const numValue = value === '' ? null : Number(value);
    if (numValue !== null && (isNaN(numValue) || numValue < 0)) {
      alert('Please enter a valid number (0 or greater)');
      return;
    }
    onApply(startDate, endDate, numValue, section === 'rate-plans' ? selectedField : undefined);
    onClose();
  };

  const getFieldLabel = () => {
    if (section === 'room-types') {
      return 'Inventory';
    }
    return 'Rate';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Bulk Update</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date Range */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <div className="flex items-center gap-2 bg-gray-50 border rounded-md px-3 py-2">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={format(startDate, 'yyyy-MM-dd')}
                  min={format(today, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    const picked = new Date(e.target.value);
                    handleStartDateChange(picked);
                  }}
                  className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <div className="flex items-center gap-2 bg-gray-50 border rounded-md px-3 py-2">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={format(endDate, 'yyyy-MM-dd')}
                  min={format(startDate, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    const picked = new Date(e.target.value);
                    handleEndDateChange(picked);
                  }}
                  className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer flex-1"
                />
              </div>
            </div>
          </div>

          {/* Field Selection for Rate Plans */}
          {section === 'rate-plans' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rate Type
              </label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rateField"
                    value="baseRateAdult1"
                    checked={selectedField === 'baseRateAdult1'}
                    onChange={(e) => setSelectedField(e.target.value as 'baseRateAdult1')}
                    className="w-4 h-4 text-[#2A3170] focus:ring-[#2A3170]"
                  />
                  <span className="text-sm text-gray-700">Rate (1 Adult)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rateField"
                    value="baseRateAdult2"
                    checked={selectedField === 'baseRateAdult2'}
                    onChange={(e) => setSelectedField(e.target.value as 'baseRateAdult2')}
                    className="w-4 h-4 text-[#2A3170] focus:ring-[#2A3170]"
                  />
                  <span className="text-sm text-gray-700">Rate (2 Adults)</span>
                </label>
              </div>
            </div>
          )}

          {/* Value Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {getFieldLabel()}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A3170] focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              This value will be applied to all dates in the selected range
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#2A3170] hover:bg-[#1a2040] rounded transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

