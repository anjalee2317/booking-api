import { IsDateString, IsOptional, IsString, IsUUID, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsAfterConstraint } from '../../common/validators/is-after.validator';

export class CreateBookingDto {
  @IsDateString({}, { message: 'startTime must be a valid date string' })
  startTime: string;

  @IsDateString({}, { message: 'endTime must be a valid date string' })
  @Validate(IsAfterConstraint, ['startTime'])
  endTime: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsUUID() // Assuming userId is a UUID
  userId: string;
}
