import { IsDateString, IsOptional, IsString, IsUUID, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsAfterConstraint } from '../../common/validators/is-after.validator';

export class UpdateBookingDto {
  @IsDateString()
  @Type(() => Date)
  startTime: Date;

  @IsDateString()
  @Type(() => Date)
  @Validate(IsAfterConstraint, ['startTime'])
  endTime: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsUUID()
  userId: string;
}

