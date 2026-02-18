import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Habit } from './habit.entity';
import { Completion } from '../completions/completion.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private habitsRepo: Repository<Habit>,
    @InjectRepository(Completion)
    private completionsRepo: Repository<Completion>,
  ) {}

  async findAll(userId: number): Promise<Habit[]> {
    return this.habitsRepo.find({
      where: { userId, isActive: true },
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Habit> {
    const habit = await this.habitsRepo.findOne({ where: { id } });
    if (!habit) throw new NotFoundException('Habit not found');
    if (habit.userId !== userId) throw new ForbiddenException();
    return habit;
  }

  async create(userId: number, data: Partial<Habit>): Promise<Habit> {
    const count = await this.habitsRepo.count({ where: { userId } });
    const habit = this.habitsRepo.create({ ...data, userId, order: count });
    return this.habitsRepo.save(habit);
  }

  async update(id: number, userId: number, data: Partial<Habit>): Promise<Habit> {
    const habit = await this.findOne(id, userId);
    Object.assign(habit, data);
    return this.habitsRepo.save(habit);
  }

  async remove(id: number, userId: number): Promise<void> {
    const habit = await this.findOne(id, userId);
    habit.isActive = false;
    await this.habitsRepo.save(habit);
  }

  async getWithStats(userId: number, dateStr: string): Promise<any[]> {
    const habits = await this.findAll(userId);
    const date = new Date(dateStr);
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const results = await Promise.all(
      habits.map(async (habit) => {
        const todayCompletions = await this.completionsRepo.count({
          where: { habitId: habit.id, completedAt: Between(dayStart, dayEnd) },
        });

        const streak = await this.calculateStreak(habit.id, dateStr);

        return {
          ...habit,
          completedToday: todayCompletions > 0,
          completedCount: todayCompletions,
          streak,
        };
      }),
    );
    return results;
  }

  async calculateStreak(habitId: number, upToDateStr: string): Promise<number> {
    let streak = 0;
    const upTo = new Date(upToDateStr);

    for (let i = 0; i < 365; i++) {
      const d = new Date(upTo);
      d.setDate(d.getDate() - i);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);

      const count = await this.completionsRepo.count({
        where: { habitId, completedAt: Between(start, end) },
      });

      if (count > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }
}