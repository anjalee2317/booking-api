import { IsDateString, IsOptional, IsString, IsUUID, Validate, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsAfterConstraint } from '../../common/validators/is-after.validator';
import { BookingStatus } from '../types/booking.types';

export class UpdateBookingDto {
  @IsOptional()
  @IsDateString({}, { message: 'startTime must be a valid date string' })
  startTime?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endTime must be a valid date string' })
  @Validate(IsAfterConstraint, ['startTime'])
  endTime?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
