// /**
//  * Change Tracker Utility
//  * 
//  * Manages unsaved changes for availability and rates separately.
//  * Provides functions to register, detect, build payloads, and discard changes.
//  */

// import type {
//   ChangeTrackerState,
//   AvailabilityChange,
//   RateChange,
//   AvailabilityChangeKey,
//   RateChangeKey,
//   Occupancy,
//   AvailabilityPayload,
//   RatePayload,
// } from '@/types/changeTracking';

// /**
//  * Generate unique key for availability change
//  */
// export function getAvailabilityKey(roomTypeId: string, date: Date): AvailabilityChangeKey {
//   return `${roomTypeId}:${date.toISOString().split('T')[0]}`;
// }

// /**
//  * Generate unique key for rate change
//  */
// export function getRateKey(
//   roomTypeId: string,
//   ratePlanId: string,
//   occupancy: Occupancy,
//   date: Date
// ): RateChangeKey {
//   return `${roomTypeId}:${ratePlanId}:${occupancy}:${date.toISOString().split('T')[0]}`;
// }

// /**
//  * Create a new change tracker state
//  */
// export function createChangeTracker(): ChangeTrackerState {
//   return {
//     availability: new Map(),
//     rates: new Map(),
//   };
// }

// /**
//  * Register an availability change
//  */
// export function registerAvailabilityChange(
//   state: ChangeTrackerState,
//   roomTypeId: string,
//   date: Date,
//   newValue: number,
//   originalValue: number
// ): ChangeTrackerState {
//   const key = getAvailabilityKey(roomTypeId, date);
//   const newState = { ...state, availability: new Map(state.availability) };

//   // If value matches original, remove the change
//   if (newValue === originalValue) {
//     newState.availability.delete(key);
//   } else {
//     // Check if there's an existing change to preserve original value
//     const existing = state.availability.get(key);
//     newState.availability.set(key, {
//       roomTypeId,
//       date,
//       value: newValue,
//       originalValue: existing?.originalValue ?? originalValue,
//     });
//   }

//   return newState;
// }

// /**
//  * Register a rate change
//  */
// export function registerRateChange(
//   state: ChangeTrackerState,
//   roomTypeId: string,
//   ratePlanId: string,
//   occupancy: Occupancy,
//   date: Date,
//   newValue: number | null,
//   originalValue: number | null
// ): ChangeTrackerState {
//   const key = getRateKey(roomTypeId, ratePlanId, occupancy, date);
//   const newState = { ...state, rates: new Map(state.rates) };

//   // If value matches original, remove the change
//   if (newValue === originalValue) {
//     newState.rates.delete(key);
//   } else {
//     // Check if there's an existing change to preserve original value
//     const existing = state.rates.get(key);
//     newState.rates.set(key, {
//       roomTypeId,
//       ratePlanId,
//       occupancy,
//       date,
//       value: newValue,
//       originalValue: existing?.originalValue ?? originalValue,
//     });
//   }

//   return newState;
// }

// /**
//  * Check if there are any unsaved changes
//  */
// export function hasUnsavedChanges(state: ChangeTrackerState): boolean {
//   return state.availability.size > 0 || state.rates.size > 0;
// }

// /**
//  * Get total count of unsaved changes
//  */
// export function getChangeCount(state: ChangeTrackerState): number {
//   return state.availability.size + state.rates.size;
// }

// /**
//  * Build availability payloads for API calls
//  */
// export function buildAvailabilityPayloads(state: ChangeTrackerState): AvailabilityPayload[] {
//   return Array.from(state.availability.values()).map((change) => ({
//     roomTypeId: change.roomTypeId,
//     date: change.date.toISOString().split('T')[0],
//     inventory: change.value,
//   }));
// }

// /**
//  * Build rate payloads for API calls
//  */
// export function buildRatePayloads(state: ChangeTrackerState): RatePayload[] {
//   return Array.from(state.rates.values()).map((change) => ({
//     roomTypeId: change.roomTypeId,
//     ratePlanId: change.ratePlanId,
//     occupancy: change.occupancy,
//     date: change.date.toISOString().split('T')[0],
//     rate: change.value,
//   }));
// }

// /**
//  * Discard all changes
//  */
// export function discardAllChanges(): ChangeTrackerState {
//   return createChangeTracker();
// }











