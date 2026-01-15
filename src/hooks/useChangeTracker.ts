// /**
//  * Change Tracker Hook
//  * 
//  * React hook that manages change tracking state and provides
//  * convenient functions for registering changes and saving.
//  */

// import { useState, useCallback, useMemo } from 'react';
// import type { ChangeTrackerState, Occupancy } from '@/types/changeTracking';

// import {
//   createChangeTracker,
//   registerAvailabilityChange,
//   registerRateChange,
//   hasUnsavedChanges,
//   getChangeCount,
//   buildAvailabilityPayloads,
//   buildRatePayloads,
//   discardAllChanges,
// } from '@/utils/changeTracker';

// import { updateAvailability, updateRate } from '@/services/api';

// export function useChangeTracker() {
//   const [state, setState] = useState<ChangeTrackerState>(createChangeTracker());

//   /**
//    * Register an availability change
//    */
//   const registerAvailability = useCallback(
//     (roomTypeId: string, date: Date, newValue: number, originalValue: number) => {
//       setState((prevState) =>
//         registerAvailabilityChange(prevState, roomTypeId, date, newValue, originalValue)
//       );
//     },
//     []
//   );

//   /**
//    * Register a rate change
//    */
//   const registerRate = useCallback(
//     (
//       roomTypeId: string,
//       ratePlanId: string,
//       occupancy: Occupancy,
//       date: Date,
//       newValue: number | null,
//       originalValue: number | null
//     ) => {
//       setState((prevState) =>
//         registerRateChange(prevState, roomTypeId, ratePlanId, occupancy, date, newValue, originalValue)
//       );
//     },
//     []
//   );

//   /**
//    * Check if there are unsaved changes
//    */
//   const hasChanges = useMemo(() => hasUnsavedChanges(state), [state]);

//   /**
//    * Get change count
//    */
//   const changeCount = useMemo(() => getChangeCount(state), [state]);

//   /**
//    * Save all changes (calls API for each change)
//    */
//   const saveChanges = useCallback(async (): Promise<void> => {
//     const availabilityPayloads = buildAvailabilityPayloads(state);
//     const ratePayloads = buildRatePayloads(state);

//     // Call API for each availability change
//     const availabilityPromises = availabilityPayloads.map((payload) =>
//       updateAvailability(payload)
//     );

//     // Call API for each rate change
//     const ratePromises = ratePayloads.map((payload) => updateRate(payload));

//     // Execute all API calls
//     await Promise.all([...availabilityPromises, ...ratePromises]);

//     // Clear changes after successful save
//     setState(discardAllChanges());
//   }, [state]);

//   /**
//    * Discard all changes
//    */
//   const discardChanges = useCallback(() => {
//     setState(discardAllChanges());
//   }, []);

//   return {
//     registerAvailability,
//     registerRate,
//     hasChanges,
//     changeCount,
//     saveChanges,
//     discardChanges,
//   };
// }






