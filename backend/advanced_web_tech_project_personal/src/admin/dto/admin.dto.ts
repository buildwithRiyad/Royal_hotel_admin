import { IsString, IsEmail, IsIn, IsNotEmpty, Matches, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name must contain alphabets only' })
  name!: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9_@]{8,}$/, { 
    message: 'Password must be at least 8 characters and contain only letters, numbers, underscore (_) or @' 
  })
  password!: string;

  // ✅ ADD 'admin' here
  @IsIn(['admin', 'manager', 'receptionist', 'customer'])
  role!: 'admin' | 'manager' | 'receptionist' | 'customer';

  @IsNotEmpty()
  @Matches(/^\d{13}$|^\d{17}$/, { message: 'NID must be 13 or 17 digits' })
  nidNumber!: string;
}

export class UpdateUserDto {
  @IsOptional()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name must contain alphabets only' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsOptional()
  @Matches(/^[A-Za-z0-9_@]{8,}$/, { 
    message: 'Password must be at least 8 characters and contain only letters, numbers, underscore (_) or @' 
  })
  password?: string;

  // ✅ ADD 'admin' here
  @IsOptional()
  @IsIn(['admin', 'manager', 'receptionist', 'customer'])
  role?: 'admin' | 'manager' | 'receptionist' | 'customer';

  @IsOptional()
  @Matches(/^\d{13}$|^\d{17}$/, { message: 'NID must be 13 or 17 digits' })
  nidNumber?: string;
}

export class AssignRoleDto {
  @IsNotEmpty()
  // ✅ ADD 'admin' here
  @IsIn(['admin', 'manager', 'receptionist', 'customer'])
  role!: 'admin' | 'manager' | 'receptionist' | 'customer';
}