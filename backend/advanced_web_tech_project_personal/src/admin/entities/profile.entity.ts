import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  dob?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;
}