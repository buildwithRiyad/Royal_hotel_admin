import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  roomNumber!: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'checkIn must be a valid date string' })
  checkIn!: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'checkOut must be a valid date string' })
  checkOut!: string;

  @IsOptional()
  @IsString()
  roomType?: string;

  @IsOptional()
  @IsInt()
  guestCount?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  paymentStatus?: string; // e.g. 'paid' | 'unpaid'

  @IsOptional()
  @IsString()
  specialRequests?: string;
}