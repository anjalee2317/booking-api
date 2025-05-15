import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingService } from './services/booking.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingService, PrismaService],
  exports: [BookingService],
})
export class BookingsModule {}
