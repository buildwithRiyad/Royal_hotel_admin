import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

import { AdminService } from './admin.service';
import { AuthService } from './auth/auth.service';

import { CreateUserDto, UpdateUserDto, AssignRoleDto } from './dto/admin.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { Admin_pipe } from './pipes/admin_pipe.pipe';
import { JwtAuthGuard } from './auth/jwt.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';

// ================= FILE UPLOAD CONFIG =================
const nidUploadConfig = {
  storage: diskStorage({
    destination: join(process.cwd(), 'uploads/nid'),
    filename: (_req, file, cb) => {
      const uniqueSuffix =
        Date.now() + '-' + Math.round(Math.random() * 1e9);

      const ext = file.originalname.split('.').pop();
      cb(null, `nid-${uniqueSuffix}.${ext}`);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Only JPEG/PNG allowed'), false);
    }
  },
};

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  // ================= AUTH =================

  @Post('register')
  async register(@Body(Admin_pipe) dto: CreateUserDto) {
    return this.adminService.registerAdmin(dto);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // ================= USER MANAGEMENT =================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('nidImage', nidUploadConfig))
  create(
    @Body(Admin_pipe) dto: CreateUserDto,
    @UploadedFile() nidImage?: Express.Multer.File,
  ) {
    return this.adminService.create(dto, nidImage);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  findAllProtected() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body(Admin_pipe) dto: UpdateUserDto) {
    return this.adminService.update(id, dto);
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  assignRole(@Param('id') id: string, @Body(Admin_pipe) dto: AssignRoleDto) {
    return this.adminService.assignRole(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  // ================= SYSTEM =================

  @Get('logs/all')
  logs() {
    return this.adminService.logs();
  }

  @Post('backup')
  backup() {
    return this.adminService.backup();
  }

  @Post('restore')
  restore(@Body() body: any) {
    return this.adminService.restore(body);
  }

  // ================= BOOKINGS =================

  @Get('bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllBookings() {
    return this.adminService.getAllBookings();
  }

  @Post('users/:id/bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createBooking(
    @Param('id') id: string,
    @Body(Admin_pipe) dto: CreateBookingDto,
  ) {
    return this.adminService.createBookingByAdmin(id, dto);
  }

  @Get('bookings/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getBooking(@Param('id') id: string) {
    return this.adminService.getBookingByIdAdmin(id);
  }

  @Patch('bookings/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateBooking(
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.adminService.updateBookingByAdmin(id, dto);
  }

  @Delete('bookings/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteBooking(@Param('id') id: string) {
    return this.adminService.deleteBookingByAdmin(id);
  }

  // ================= PROFILES =================

  @Get('profiles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllProfiles() {
    return this.adminService.getAllProfiles();
  }

  @Get('users/:id/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getProfile(@Param('id') id: string) {
    return this.adminService.getProfileByUserId(id);
  }

  @Post('users/:id/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createProfile(
    @Param('id') id: string,
    @Body(Admin_pipe) dto: CreateProfileDto,
  ) {
    return this.adminService.createProfileByAdmin(id, dto);
  }

  @Put('users/:id/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.adminService.updateProfileByAdmin(id, dto);
  }

  @Delete('users/:id/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteProfile(@Param('id') id: string) {
    return this.adminService.deleteProfileByUserId(id);
  }
}