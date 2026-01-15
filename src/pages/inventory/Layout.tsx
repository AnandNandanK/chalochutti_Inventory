// Layout.tsx - Updated to use route-based rendering
import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  startOfToday,
  addDays,
  isBefore,
  isSameDay,
  eachDayOfInterval,
} from "date-fns";
import { DateSelector } from "@/components/inventory/DateSelector";
import { NavigationTabs } from "@/components/inventory/NavigationTabs";
import { RoomTypesGrid } from "@/components/inventory/RoomTypesGrid";
import { RatePlansGrid } from "@/components/inventory/RatePlansGrid";
import { SaveCancelButtons } from "@/components/inventory/SaveCancelButtons";
import { BulkUpdateModal } from "@/components/inventory/BulkUpdateModal";
import { INITIAL_ROOM_DATA, TAB_OPTIONS } from "@/data/dummyData";
import type { RoomType } from "@/types";
import { updateAvailability, updateRate } from "@/services/api";

// Helper functions remain the same...
const deepCloneRooms = (rooms: RoomType[]): RoomType[] => {
  return JSON.parse(JSON.stringify(rooms));
};

const hasRoomsChanged = (
  current: RoomType[],
  baseline: RoomType[]
): boolean => {
  return JSON.stringify(current) !== JSON.stringify(baseline);
};

const countChanges = (
  current: RoomType[],
  baseline: RoomType[],
  dates: Date[],
  section: "room-types" | "rate-plans"
): number => {
  let count = 0;

  for (const room of current) {
    const baselineRoom = baseline.find((r) => r.id === room.id);
    if (!baselineRoom) continue;

    for (let i = 0; i < dates.length; i++) {
      if (section === "room-types") {
        const currentInventory = room.ratePlans[0]?.dailyData[i]?.inventory;
        const baselineInventory =
          baselineRoom.ratePlans[0]?.dailyData[i]?.inventory;

        if (
          currentInventory !== undefined &&
          baselineInventory !== undefined &&
          currentInventory !== baselineInventory
        ) {
          count++;
        }
      }

      if (section === "rate-plans") {
        for (const plan of room.ratePlans) {
          const baselinePlan = baselineRoom.ratePlans.find(
            (p) => p.id === plan.id
          );
          if (!baselinePlan) continue;

          const currentData = plan.dailyData[i];
          const baselineData = baselinePlan.dailyData[i];
          if (!currentData || !baselineData) continue;

          if (
            (currentData.baseRateAdult1 ?? null) !==
            (baselineData.baseRateAdult1 ?? null)
          ) {
            count++;
          }

          if (
            (currentData.baseRateAdult2 ?? null) !==
            (baselineData.baseRateAdult2 ?? null)
          ) {
            count++;
          }
        }
      }
    }
  }

  return count;
};

export default function Layout() {
  const today = startOfToday();
  const location = useLocation();

  // ✅ Derive section from URL path
  const activeSidebarSection: "room-types" | "rate-plans" =
    location.pathname.includes("/room-type") ||
    location.pathname.includes("/room-types")
      ? "room-types"
      : "rate-plans";

  const [activeTab, setActiveTab] = useState(TAB_OPTIONS[0].id);
  const [baseDate, setBaseDate] = useState(startOfToday());
  const [activeDate, setActiveDate] = useState(startOfToday());
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);

  // Reset key now includes the URL-based section
  const resetKey = useMemo(() => {
    return `${activeSidebarSection}-${baseDate.toISOString()}`;
  }, [activeSidebarSection, baseDate]);

  const [currentResetKey, setCurrentResetKey] = useState(resetKey);

  const [rooms, setRooms] = useState<RoomType[]>(() =>
    deepCloneRooms(INITIAL_ROOM_DATA)
  );

  const [baseline, setBaseline] = useState<RoomType[]>(() =>
    deepCloneRooms(INITIAL_ROOM_DATA)
  );

  // Reset data when resetKey changes (including route changes)
  if (currentResetKey !== resetKey) {
    const resetData = deepCloneRooms(INITIAL_ROOM_DATA);
    setCurrentResetKey(resetKey);
    setBaseline(resetData);
    setRooms(resetData);
  }

  const handleBaseDateChange = (date: Date) => {
    if (!isBefore(date, today) || isSameDay(date, today)) {
      setBaseDate(date);
    }
  };

  const handleActiveDateChange = (date: Date) => {
    if (!isBefore(date, today) || isSameDay(date, today)) {
      setActiveDate(date);
    }
  };

  const dates = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(baseDate, i));
  }, [baseDate]);

  const hasChanges = useMemo(() => {
    return hasRoomsChanged(rooms, baseline);
  }, [rooms, baseline]);

  const changeCount = useMemo(() => {
    return countChanges(rooms, baseline, dates, activeSidebarSection);
  }, [rooms, baseline, dates, activeSidebarSection]);

  const handleAvailabilityUpdate = (
    roomId: string,
    dateIndex: number,
    value: number
  ) => {
    setRooms((prevRooms) => {
      return prevRooms.map((room) => {
        if (room.id !== roomId) return room;
        return {
          ...room,
          ratePlans: room.ratePlans.map((plan) => ({
            ...plan,
            dailyData: plan.dailyData.map((data, idx) =>
              idx === dateIndex ? { ...data, inventory: value } : data
            ),
          })),
        };
      });
    });
  };

  const handleRateUpdate = (
    roomId: string,
    ratePlanId: string,
    dateIndex: number,
    field: "baseRateAdult1" | "baseRateAdult2",
    value: number | null
  ) => {
    setRooms((prevRooms) => {
      return prevRooms.map((room) => {
        if (room.id !== roomId) return room;
        return {
          ...room,
          ratePlans: room.ratePlans.map((plan) => {
            if (plan.id !== ratePlanId) return plan;
            return {
              ...plan,
              dailyData: plan.dailyData.map((data, idx) =>
                idx === dateIndex ? { ...data, [field]: value } : data
              ),
            };
          }),
        };
      });
    });
  };

  const handleSave = async () => {
    try {
      const baselineData = baseline;
      const current = rooms;
      const dateStrings = dates.map((d) => d.toISOString().split("T")[0]);

      const promises: Promise<void>[] = [];

      for (const room of current) {
        const baselineRoom = baselineData.find((r) => r.id === room.id);
        if (!baselineRoom) continue;

        for (let i = 0; i < dates.length; i++) {
          const dateStr = dateStrings[i];

          if (activeSidebarSection === "room-types") {
            const currentInventory = room.ratePlans[0]?.dailyData[i]?.inventory;
            const baselineInventory =
              baselineRoom.ratePlans[0]?.dailyData[i]?.inventory;

            if (
              currentInventory !== undefined &&
              baselineInventory !== undefined &&
              currentInventory !== baselineInventory
            ) {
              promises.push(
                updateAvailability({
                  roomTypeId: room.id,
                  date: dateStr,
                  inventory: currentInventory,
                })
              );
            }
          }

          if (activeSidebarSection === "rate-plans") {
            for (const plan of room.ratePlans) {
              const baselinePlan = baselineRoom.ratePlans.find(
                (p) => p.id === plan.id
              );
              if (!baselinePlan) continue;

              const currentData = plan.dailyData[i];
              const baselineData = baselinePlan.dailyData[i];
              if (!currentData || !baselineData) continue;

              if (currentData.baseRateAdult1 !== baselineData.baseRateAdult1) {
                promises.push(
                  updateRate({
                    roomTypeId: room.id,
                    ratePlanId: plan.id,
                    occupancy: 1,
                    date: dateStr,
                    rate: currentData.baseRateAdult1,
                  })
                );
              }

              if (currentData.baseRateAdult2 !== baselineData.baseRateAdult2) {
                promises.push(
                  updateRate({
                    roomTypeId: room.id,
                    ratePlanId: plan.id,
                    occupancy: 2,
                    date: dateStr,
                    rate: currentData.baseRateAdult2,
                  })
                );
              }
            }
          }
        }
      }

      await Promise.all(promises);
      setBaseline(deepCloneRooms(rooms));
      alert(`Saved ${changeCount} change(s) successfully!`);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => {
    setRooms(deepCloneRooms(baseline));
  };

  const handleBulkUpdate = (
    startDate: Date,
    endDate: Date,
    value: number | null,
    field?: "baseRateAdult1" | "baseRateAdult2"
  ) => {
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    setRooms((prevRooms) => {
      return prevRooms.map((room) => {
        if (activeSidebarSection === "room-types") {
          return {
            ...room,
            ratePlans: room.ratePlans.map((plan) => {
              const updatedDailyData = plan.dailyData.map((data, idx) => {
                const currentDate = dates[idx];
                const isInRange = dateRange.some((rangeDate) =>
                  isSameDay(rangeDate, currentDate)
                );

                if (isInRange && value !== null) {
                  return { ...data, inventory: value };
                }
                return data;
              });

              return {
                ...plan,
                dailyData: updatedDailyData,
              };
            }),
          };
        } else {
          if (!field) return room;

          return {
            ...room,
            ratePlans: room.ratePlans.map((plan) => {
              const updatedDailyData = plan.dailyData.map((data, idx) => {
                const currentDate = dates[idx];
                const isInRange = dateRange.some((rangeDate) =>
                  isSameDay(rangeDate, currentDate)
                );

                if (isInRange) {
                  return { ...data, [field]: value };
                }
                return data;
              });

              return {
                ...plan,
                dailyData: updatedDailyData,
              };
            }),
          };
        }
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex pt-3 ">
          {/* ✅ Sidebar now just reflects the current route */}
          <div className="flex-1 px-6 ">
            <div className="pb-0">
              <NavigationTabs
                tabs={TAB_OPTIONS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <DateSelector
                    baseDate={baseDate}
                    onBaseDateChange={handleBaseDateChange}
                    onActiveDateChange={handleActiveDateChange}
                  />
                </div>
                <div className="ml-4 mb-6">
                  <button
                    onClick={() => setIsBulkUpdateModalOpen(true)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-[#2A3170] hover:bg-[#1a2040] rounded transition-colors flex items-center gap-2"
                  >
                    Bulk Update
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ Grid shown based on URL-derived section */}
            {activeSidebarSection === "room-types" ? (
              <RoomTypesGrid
                rooms={rooms}
                baseDate={baseDate}
                activeDate={activeDate}
                onUpdate={handleAvailabilityUpdate}
                onActiveDateChange={handleActiveDateChange}
              />
            ) : (
              <RatePlansGrid
                rooms={rooms}
                baseDate={baseDate}
                activeDate={activeDate}
                onUpdate={handleRateUpdate}
                onActiveDateChange={handleActiveDateChange}
              />
            )}
          </div>
        </div>
      </div>

      <SaveCancelButtons
        hasChanges={hasChanges}
        changeCount={changeCount}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <BulkUpdateModal
        isOpen={isBulkUpdateModalOpen}
        onClose={() => setIsBulkUpdateModalOpen(false)}
        onApply={handleBulkUpdate}
        section={activeSidebarSection}
      />
    </div>
  );
}
