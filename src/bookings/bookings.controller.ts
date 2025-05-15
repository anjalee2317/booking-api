import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './types/booking.types';
import { ReqContext, RequestContext } from '../common/context/request-context';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  findAll(@ReqContext() context: RequestContext): Promise<Booking[]> {
    console.log(`Request ID: ${context.requestId}`);
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.remove(id);
  }
}
