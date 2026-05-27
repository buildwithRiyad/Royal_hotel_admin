import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Booking } from './entities/booking.entity';
import { Profile } from './entities/profile.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from './dto/admin.dto';
import { PusherService } from './pusher.service';

type ActivityLog = {
  timestamp: string;
  action: string;
  target?: string;
  details?: string;
};

type RestoreBody = {
  snapshot?: {
    users?: User[];
    logs?: ActivityLog[];
  };
};

@Injectable()
export class AdminService implements OnModuleInit {   // ✅ implement OnModuleInit
  private readonly activityLogs: ActivityLog[] = [];

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    private readonly dataSource: DataSource,
    private readonly pusherService: PusherService,
  ) {}

  // ========== SEED FIRST ADMIN (runs once when module starts) ==========
  async onModuleInit() {
    await this.seedFirstAdmin();
  }

  // ========== BOOKINGS (admin) ==========
  async getAllBookings() {
    return this.bookingRepo.find({ relations: ['user'], order: { id: 'DESC' } });
  }

  async getBookingByIdAdmin(id: string) {
    const bid = this.parseIdOrThrow(id, 'booking id');
    const booking = await this.bookingRepo.findOne({ where: { id: bid }, relations: ['user'] as any });
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    return booking;
  }

  async createBookingByAdmin(userId: string, dto: CreateBookingDto) {
    const uid = this.parseIdOrThrow(userId, 'user id');
    const user = await this.userRepo.findOne({ where: { id: uid } });
    if (!user) throw new NotFoundException('User not found');

    const booking = this.bookingRepo.create({
      roomNumber: dto.roomNumber,
      checkIn: dto.checkIn,
      checkOut: dto.checkOut,
      roomType: dto.roomType,
      guestCount: dto.guestCount,
      price: dto.price,
      paymentStatus: dto.paymentStatus,
      specialRequests: dto.specialRequests,
      user,
    });

    const savedBooking = await this.bookingRepo.save(booking);
    this.recordLog('booking.created', `booking:${savedBooking.id}`, `user:${user.id}`);
    return savedBooking;
  }

  async updateBookingByAdmin(id: string, dto: UpdateBookingDto) {
    const bid = this.parseIdOrThrow(id, 'booking id');
    const booking = await this.bookingRepo.findOne({ where: { id: bid }, relations: ['user'] as any });
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);

    if ((dto as any).roomNumber !== undefined) booking.roomNumber = (dto as any).roomNumber;
    if ((dto as any).checkIn !== undefined) booking.checkIn = (dto as any).checkIn;
    if ((dto as any).checkOut !== undefined) booking.checkOut = (dto as any).checkOut;
    if ((dto as any).roomType !== undefined) booking.roomType = (dto as any).roomType;
    if ((dto as any).guestCount !== undefined) booking.guestCount = (dto as any).guestCount;
    if ((dto as any).price !== undefined) booking.price = (dto as any).price;
    if ((dto as any).paymentStatus !== undefined) booking.paymentStatus = (dto as any).paymentStatus;
    if ((dto as any).specialRequests !== undefined) booking.specialRequests = (dto as any).specialRequests;

    return this.bookingRepo.save(booking);
  }

  async deleteBookingByAdmin(id: string) {
    const bid = this.parseIdOrThrow(id, 'booking id');
    const booking = await this.bookingRepo.findOne({ where: { id: bid } as any });
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    await this.bookingRepo.remove(booking);
    return { message: 'deleted' };
  }

  // ========== PROFILES (admin) ==========
  async getAllProfiles() {
    return this.profileRepo.find({
      relations: ['user'] as any,
      order: { id: 'DESC' },
    });
  }

  async getProfileByUserId(userId: string) {
    const uid = this.parseIdOrThrow(userId, 'user id');
    const profile = await this.profileRepo.findOne({ where: { user: { id: uid } as any }, relations: ['user'] as any });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async createProfileByAdmin(userId: string, dto: CreateProfileDto) {
    const uid = this.parseIdOrThrow(userId, 'user id');
    const user = await this.userRepo.findOne({ where: { id: uid } });
    if (!user) throw new NotFoundException('User not found');

    const existingProfile = await this.profileRepo.findOne({ where: { user: { id: uid } as any } });
    if (existingProfile) throw new ConflictException('Profile already exists');

    const profile = this.profileRepo.create({
      phone: dto.phone,
      address: dto.address,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dob: dto.dob,
      gender: dto.gender,
      city: dto.city,
      country: dto.country,
      user,
    });

    const savedProfile = await this.profileRepo.save(profile);
    this.recordLog('profile.created', `profile:${savedProfile.id}`, `user:${user.id}`);
    return savedProfile;
  }

  async updateProfileByAdmin(userId: string, dto: UpdateProfileDto) {
    const uid = this.parseIdOrThrow(userId, 'user id');
    const user = await this.userRepo.findOne({ where: { id: uid } });
    if (!user) throw new NotFoundException('User not found');

    let profile = await this.profileRepo.findOne({ where: { user: { id: uid } as any }, relations: ['user'] as any });
    if (!profile) throw new NotFoundException('Profile not found');

    if ((dto as any).phone !== undefined) profile.phone = (dto as any).phone;
    if ((dto as any).address !== undefined) profile.address = (dto as any).address;
    if ((dto as any).firstName !== undefined) profile.firstName = (dto as any).firstName;
    if ((dto as any).lastName !== undefined) profile.lastName = (dto as any).lastName;
    if ((dto as any).dob !== undefined) profile.dob = (dto as any).dob;
    if ((dto as any).gender !== undefined) profile.gender = (dto as any).gender;
    if ((dto as any).city !== undefined) profile.city = (dto as any).city;
    if ((dto as any).country !== undefined) profile.country = (dto as any).country;

    return this.profileRepo.save(profile);
  }

  async deleteProfileByUserId(userId: string) {
    const uid = this.parseIdOrThrow(userId, 'user id');
    const profile = await this.profileRepo.findOne({ where: { user: { id: uid } as any }, relations: ['user'] as any });
    if (!profile) throw new NotFoundException('Profile not found');

    await this.profileRepo.remove(profile);
    this.recordLog('profile.deleted', `profile:${profile.id}`, `user:${uid}`);
    return { message: 'deleted' };
  }

  private async seedFirstAdmin() {
    const existingAdmin = await this.userRepo.findOne({
      where: { role: 'admin' },
    });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      const firstAdmin = this.userRepo.create({
        name: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        nidNumber: '0000000000000',    // dummy 13-digit NID
        nidImage: null,
      });
      await this.userRepo.save(firstAdmin);
      this.recordLog('system.first_admin_created', 'system', 'admin@gmail.com');
      await this.pusherService.notifyAdmin('Default admin created', {
        type: 'admin.seeded',
        email: 'admin@gmail.com',
      });
      console.log('✅ Default admin created: admin@gmail.com / admin');
    }
  }

  // ------------- UTILITY -------------
  private parseIdOrThrow(value: string, field: string): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0)
      throw new BadRequestException(`${field} must be positive integer`);
    return id;
  }

  private recordLog(action: string, target?: string, details?: string) {
    this.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action,
      target,
      details,
    });
  }

  // ------------- USERS -------------
  /** Register a new admin account */
  async registerAdmin(dto: CreateUserDto) {
    if (await this.userRepo.findOne({ where: { email: dto.email } }))
      throw new ConflictException(`Email ${dto.email} exists`);

    const admin = this.userRepo.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
      nidImage: null,
    });

    const savedAdmin = await this.userRepo.save(admin);
    this.recordLog('admin.registered', `admin:${savedAdmin.id}`, savedAdmin.email);
    await this.pusherService.notifyAdmin('Admin registered', {
      type: 'admin.registered',
      userId: savedAdmin.id,
      email: savedAdmin.email,
    });
    return savedAdmin;
  }

  /** Create user w/ hashed password & optional NID image */
  async create(dto: CreateUserDto, nidImage?: Express.Multer.File) {
    // Check for duplicate email
    if (await this.userRepo.findOne({ where: { email: dto.email } }))
      throw new ConflictException(`Email ${dto.email} exists`);

    const user = this.userRepo.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
      nidImage: nidImage?.filename,
    });
    const savedUser = await this.userRepo.save(user);
    this.recordLog('user.created', `user:${savedUser.id}`, savedUser.email);
    await this.pusherService.notifyAdmin('User created', {
      type: 'user.created',
      userId: savedUser.id,
      email: savedUser.email,
    });
    return savedUser;
  }

  /** Get all users, optional role filter */
  async findAll(role?: string) {
    return this.userRepo.find({
      where: role ? { role } : {},
    });
  }

  /** Get single user by ID */
  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id: this.parseIdOrThrow(id, 'id') },
    });
    if (!user) throw new NotFoundException(`User ID ${id} not found`);
    return user;
  }

  /** Update user, hash password if present */
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
    Object.assign(user, dto);
    const savedUser = await this.userRepo.save(user);
    this.recordLog('user.updated', `user:${savedUser.id}`);
    await this.pusherService.notifyAdmin('User updated', {
      type: 'user.updated',
      userId: savedUser.id,
    });
    return savedUser;
  }

  /** Assign role to user */
  async assignRole(id: string, dto: AssignRoleDto) {
    const user = await this.findOne(id);
    user.role = dto.role;
    const savedUser = await this.userRepo.save(user);
    this.recordLog('user.role_assigned', `user:${savedUser.id}`, dto.role);
    await this.pusherService.notifyAdmin('Role assigned', {
      type: 'user.role_assigned',
      userId: savedUser.id,
      role: dto.role,
    });
    return savedUser;
  }

  /** Delete user */
  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
    this.recordLog('user.deleted', `user:${id}`);
    await this.pusherService.notifyAdmin('User deleted', {
      type: 'user.deleted',
      userId: id,
    });
    return { message: 'deleted' };
  }

  // ------------- LOGS / BACKUP -------------
  logs() {
    return this.activityLogs;
  }

  async backup() {
    const users = await this.userRepo.find();
    this.recordLog('system.backup_created', 'system');
    await this.pusherService.notifyAdmin('Backup created', {
      type: 'system.backup_created',
      userCount: users.length,
    });
    return {
      message: 'backup done',
      snapshot: {
        users,
        logs: this.activityLogs,
      },
    };
  }

  async restore(body: RestoreBody) {
    const users = body?.snapshot?.users;

    if (!Array.isArray(users)) {
      throw new BadRequestException('snapshot.users is required');
    }

    await this.dataSource.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
    const restoredUsers = await this.userRepo.save(users);

    this.activityLogs.length = 0;
    if (Array.isArray(body?.snapshot?.logs)) {
      this.activityLogs.push(...body.snapshot.logs);
    }
    this.recordLog('system.restore_completed', 'system', `restored ${restoredUsers.length} users`);
    await this.pusherService.notifyAdmin('Restore completed', {
      type: 'system.restore_completed',
      restoredUsers: restoredUsers.length,
    });

    return {
      message: 'restore done',
      restoredUsers: restoredUsers.length,
    };
  }
}