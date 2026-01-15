/**
 * API Service
 * 
 * Contains API call functions for availability and rate updates.
 * Each change triggers a separate API call (manual mode, no batching).
 */

import type { AvailabilityPayload, RatePayload } from '@/types/changeTracking';

/**
 * Update availability for a room type on a specific date
 */
export async function updateAvailability(payload: AvailabilityPayload): Promise<void> {
  // TODO: Replace with actual API endpoint
  // Example: POST /api/availability
  console.log('[API] Updating availability:', payload);
  
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  // In production, replace with:
  // const response = await fetch('/api/availability', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to update availability');
}

/**
 * Update rate for a room type, rate plan, occupancy, and date
 */
export async function updateRate(payload: RatePayload): Promise<void> {
  // TODO: Replace with actual API endpoint
  // Example: POST /api/rates
  console.log('[API] Updating rate:', payload);
  
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  // In production, replace with:
  // const response = await fetch('/api/rates', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to update rate');
}











