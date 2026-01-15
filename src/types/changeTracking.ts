/**
 * Change Tracking Types
 * 
 * Tracks unsaved changes separately for availability and rates.
 * Each change has a unique key to identify which API endpoint to call.
 */

export type Occupancy = 1 | 2;

export type ChangeType = 'availability' | 'rate';

/**
 * Unique key for an availability change
 * Format: roomTypeId:dateISO
 */
export type AvailabilityChangeKey = string;

/**
 * Unique key for a rate change
 * Format: roomTypeId:ratePlanId:occupancy:dateISO
 */
export type RateChangeKey = string;

/**
 * Represents a single availability change
 */
export interface AvailabilityChange {
  roomTypeId: string;
  date: Date;
  value: number;
  originalValue: number;
}

/**
 * Represents a single rate change
 */
export interface RateChange {
  roomTypeId: string;
  ratePlanId: string;
  occupancy: Occupancy;
  date: Date;
  value: number | null;
  originalValue: number | null;
}

/**
 * Change tracker state
 */
export interface ChangeTrackerState {
  availability: Map<AvailabilityChangeKey, AvailabilityChange>;
  rates: Map<RateChangeKey, RateChange>;
}

/**
 * Payload for availability API call
 */
export interface AvailabilityPayload {
  roomTypeId: string;
  date: string; // ISO date string
  inventory: number;
}

/**
 * Payload for rate API call
 */
export interface RatePayload {
  roomTypeId: string;
  ratePlanId: string;
  occupancy: Occupancy;
  date: string; // ISO date string
  rate: number | null;
}











