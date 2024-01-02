import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  dateTimeReminder: Date;
  @IsBoolean()
  @Column()
  status: boolean;
  @Column({ type: 'time' })
  time: string;
  @Column()
  priority: string;

  @Column()
  category: string;

  @Column()
  idNotification: string;
  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'usuarioId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
