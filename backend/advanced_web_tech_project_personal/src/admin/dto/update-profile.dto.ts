import { IsOptional, IsString, Matches, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @Matches(/^01[3-9][0-9]{8}$/, {
    message: 'Phone must be a valid Bangladeshi number',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
