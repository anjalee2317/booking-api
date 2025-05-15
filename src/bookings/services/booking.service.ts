import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { Booking, BookingStatus } from '../types/booking.types';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Basic validation example (more complex validation should be in DTO/Pipes)
    if (new Date(createBookingDto.endTime) <= new Date(createBookingDto.startTime)) {
      throw new BadRequestException('End time must be after start time');
    }

    // Create and save the booking entity using Prisma
    const booking = await this.prisma.booking.create({
      data: {
        ...createBookingDto,
        status: BookingStatus.PENDING, // Set default status
        // If you had a User relation, you might link it here:
        // user: { connect: { id: createBookingDto.userId } },
      },
    });
    return booking as Booking;
  }

  async findAll(): Promise<Booking[]> {
    // Retrieve all bookings
    const bookings = await this.prisma.booking.findMany();
    return bookings as Booking[];
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    return booking as Booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    // TODO: Implement validation logic if needed (e.g., check if status transition is valid)

    try {
      const updatedBooking = await this.prisma.booking.update({
        where: { id },
        data: updateBookingDto,
      });
      return updatedBooking as Booking;
    } catch (error) {
      // Handle case where booking with id is not found
      if (error.code === 'P2025') { // Prisma error code for record not found
         throw new NotFoundException(`Booking with ID "${id}" not found`);
      }
      throw error; // Re-throw other errors
    }
  }

  async remove(id: string): Promise<Booking> {
     try {
      const deletedBooking = await this.prisma.booking.delete({
        where: { id },
      });
      return deletedBooking as Booking;
    } catch (error) {
       if (error.code === 'P2025') {
         throw new NotFoundException(`Booking with ID "${id}" not found`);
      }
      throw error;
    }
  }
}