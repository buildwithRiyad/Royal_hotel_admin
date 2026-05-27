import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@InjectRepository(User)
		private userRepo: Repository<User>,
	) {}

	async login(email: string, password: string) {
		const user = await this.userRepo.findOne({ where: { email } });

		if (!user) throw new UnauthorizedException('invalid email');

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException('wrong password');
		}

		const payload = { id: user.id, role: user.role };

		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}