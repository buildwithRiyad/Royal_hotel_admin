import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roomNumber!: string;

  @Column({ nullable: true })
  roomType?: string;

  @Column({ type: 'int', nullable: true })
  guestCount?: number;

  @Column('float', { nullable: true })
  price?: number;

  @Column({ nullable: true })
  paymentStatus?: string;

  @Column({ type: 'text', nullable: true })
  specialRequests?: string;

  @Column()
  checkIn!: string;

  @Column()
  checkOut!: string;

  @ManyToOne(() => User)
  user!: User;
}