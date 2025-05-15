// Define the BookingStatus enum
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

// Define the Booking interface
export interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  status: BookingStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
