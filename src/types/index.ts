// TypeScript interfaces for Hotel Rates & Inventory Management

export interface DailyData {
  date: Date;
  inventory: number;
  baseRateAdult2: number | null;
  baseRateAdult1: number | null;
}

export interface RatePlan {
  id: string;
  name: string; // e.g., "EP", "MAP", "CP"
  dailyData: DailyData[];
}

export interface RoomType {
  id: string;
  name: string; // e.g., "Deluxe Room"
  ratePlans: RatePlan[];
}

export interface TabOption {
  id: string;
  label: string;
}

export interface DateInfo {
  day: string; // e.g., "FRI"
  date: string; // e.g., "17"
  month: string; // e.g., "NOV"
  fullDate: Date;
}

