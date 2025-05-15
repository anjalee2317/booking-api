import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './types/booking.types';
import { ReqContext, RequestContext } from '../common/context/request-context';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'The booking has been successfully created.' })
  create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, description: 'Returns all bookings' })
  findAll(@ReqContext() context: RequestContext): Promise<Booking[]> {
    console.log(`Request ID: ${context.requestId}`);
    return this.bookingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: '505f27ee-6da3-4884-89cc-c16dca69b3ba' })
  @ApiResponse({ status: 200, description: 'Returns the booking with the specified ID' })
  findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: '505f27ee-6da3-4884-89cc-c16dca69b3ba' })
  @ApiResponse({ status: 200, description: 'The booking has been successfully updated' })
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: '505f27ee-6da3-4884-89cc-c16dca69b3ba' })
  @ApiResponse({ status: 200, description: 'The booking has been successfully deleted' })
  remove(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.remove(id);
  }
}
