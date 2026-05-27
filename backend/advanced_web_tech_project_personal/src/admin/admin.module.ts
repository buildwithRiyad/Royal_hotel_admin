import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin_pipe } from './pipes/admin_pipe.pipe';
import {TypeOrmModule} from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Booking } from './entities/booking.entity';
import { Profile } from './entities/profile.entity';
import { AuthModule } from './auth/auth.module';
import { PusherService } from './pusher.service';

@Module({
  imports:[TypeOrmModule.forFeature([User, Booking, Profile]), AuthModule],
  controllers: [AdminController],
  providers: [AdminService, Admin_pipe, PusherService],
})
export class AdminModule {}