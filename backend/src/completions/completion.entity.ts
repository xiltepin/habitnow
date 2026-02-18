import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';
import { Habit } from '../habits/habit.entity';

@Entity('completions')
export class Completion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  habitId: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  completedAt: Date;

  @ManyToOne(() => Habit, (habit) => habit.completions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habitId' })
  habit: Habit;
}