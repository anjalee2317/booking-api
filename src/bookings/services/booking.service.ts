import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { Booking, BookingStatus } from '../types/booking.types';
import { User } from '../../users/types/user.types';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Basic validation example (more complex validation should be in DTO/Pipes)
    if (new Date(createBookingDto.endTime) <= new Date(createBookingDto.startTime)) {
      throw new BadRequestException('End time must be after start time');
    }

    // Create and save the booking entity using Prisma
    const bookingData = await this.prisma.booking.create({
      data: {
        startTime: new Date(createBookingDto.startTime),
        endTime: new Date(createBookingDto.endTime),
        notes: createBookingDto.notes,
        status: BookingStatus.PENDING,
        userId: createBookingDto.userId,
      },
      include: { user: true },
    });
    
    // Map to our domain model
    return this.mapPrismaBookingToBooking(bookingData);
  }

  async findAll(): Promise<Booking[]> {
    // Retrieve all bookings with user data
    const bookingsData = await this.prisma.booking.findMany({
      include: { user: true },
    });
    
    // Map to our domain models
    return bookingsData.map(bookingData => this.mapPrismaBookingToBooking(bookingData));
  }

  async findOne(id: string): Promise<Booking> {
    const bookingData = await this.prisma.booking.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!bookingData) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    
    // Map to our domain model
    return this.mapPrismaBookingToBooking(bookingData);
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    // Get the current booking to validate status transition
    const currentBooking = await this.findOne(id);
    
    // Validate status transition if status is being updated
    if (updateBookingDto.status && updateBookingDto.status !== currentBooking.status) {
      this.validateStatusTransition(currentBooking.status, updateBookingDto.status);
    }

    try {
      // Prepare update data
      const updateData: any = {};
      if (updateBookingDto.startTime) updateData.startTime = new Date(updateBookingDto.startTime);
      if (updateBookingDto.endTime) updateData.endTime = new Date(updateBookingDto.endTime);
      if (updateBookingDto.notes !== undefined) updateData.notes = updateBookingDto.notes;
      if (updateBookingDto.status) updateData.status = updateBookingDto.status;
      if (updateBookingDto.userId) updateData.userId = updateBookingDto.userId;
      
      const updatedBookingData = await this.prisma.booking.update({
        where: { id },
        data: updateData,
        include: { user: true },
      });
      
      // Map to our domain model
      return this.mapPrismaBookingToBooking(updatedBookingData);
    } catch (error) {
      // Handle case where booking with id is not found
      if (error.code === 'P2025') {
         throw new NotFoundException(`Booking with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Booking> {
     try {
      const deletedBookingData = await this.prisma.booking.delete({
        where: { id },
        include: { user: true },
      });
      
      // Map to our domain model
      return this.mapPrismaBookingToBooking(deletedBookingData);
    } catch (error) {
       if (error.code === 'P2025') {
         throw new NotFoundException(`Booking with ID "${id}" not found`);
      }
      throw error;
    }
  }

  // Helper method to map Prisma Booking model to our domain Booking model
  private mapPrismaBookingToBooking(prismaBooking: any): Booking {
    const booking: Booking = {
      id: prismaBooking.id,
      startTime: prismaBooking.startTime,
      endTime: prismaBooking.endTime,
      notes: prismaBooking.notes || undefined,
      status: prismaBooking.status as BookingStatus,
      userId: prismaBooking.userId,
      createdAt: prismaBooking.createdAt,
      updatedAt: prismaBooking.updatedAt,
    };
    
    // Add user data if available, removing sensitive information
    if (prismaBooking.user) {
      const userWithoutPassword: User = {
        id: prismaBooking.user.id,
        email: prismaBooking.user.email,
        name: prismaBooking.user.name,
        createdAt: prismaBooking.user.createdAt,
        updatedAt: prismaBooking.user.updatedAt,
      };
      booking.user = userWithoutPassword;
    }
    
    return booking;
  }

  // Validate status transition
  private validateStatusTransition(currentStatus: BookingStatus, newStatus: BookingStatus): void {
    // Define valid status transitions
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
      [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
      [BookingStatus.CANCELLED]: [], // No transitions from CANCELLED
      [BookingStatus.COMPLETED]: [], // No transitions from COMPLETED
    };

    // Check if the transition is valid
    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}. ` +
        `Valid transitions from ${currentStatus} are: ${validTransitions[currentStatus].join(', ') || 'none'}`
      );
    }
  }
}