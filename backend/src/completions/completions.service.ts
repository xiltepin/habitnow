import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Completion } from './completion.entity';
import { Habit } from '../habits/habit.entity';

@Injectable()
export class CompletionsService {
  constructor(
    @InjectRepository(Completion)
    private completionsRepo: Repository<Completion>,
    @InjectRepository(Habit)
    private habitsRepo: Repository<Habit>,
  ) {}

  async toggle(habitId: number, userId: number, dateStr?: string): Promise<{ completed: boolean }> {
    const habit = await this.habitsRepo.findOne({ where: { id: habitId } });
    if (!habit) throw new NotFoundException('Habit not found');

    const date = dateStr ? new Date(dateStr) : new Date();
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const existing = await this.completionsRepo.findOne({
      where: { habitId, userId, completedAt: Between(dayStart, dayEnd) },
    });

    if (existing) {
      await this.completionsRepo.remove(existing);
      return { completed: false };
    } else {
      const completion = this.completionsRepo.create({
        habitId, userId,
        completedAt: date,
      });
      await this.completionsRepo.save(completion);
      return { completed: true };
    }
  }

  async getHistory(habitId: number, userId: number, days = 30): Promise<any[]> {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const completions = await this.completionsRepo.find({
      where: { habitId, userId, completedAt: Between(start, end) },
      order: { completedAt: 'ASC' },
    });

    return completions.map((c) => ({
      id: c.id,
      date: c.completedAt.toISOString().split('T')[0],
      completedAt: c.completedAt,
    }));
  }

  async getMonthStats(userId: number, year: number, month: number): Promise<any> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const completions = await this.completionsRepo.find({
      where: { userId, completedAt: Between(start, end) },
      relations: ['habit'],
    });

    const byDay: Record<string, number> = {};
    completions.forEach((c) => {
      const day = c.completedAt.toISOString().split('T')[0];
      byDay[day] = (byDay[day] || 0) + 1;
    });

    return { byDay, total: completions.length };
  }
}