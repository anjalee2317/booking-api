// Define the BookingStatus enum
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

// Import the User interface
import { User } from '../../users/types/user.types';

// Define the Booking interface
export interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  status: BookingStatus;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
