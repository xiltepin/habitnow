import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { Habit } from './habit.entity';
import { Completion } from '../completions/completion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, Completion])],
  providers: [HabitsService],
  controllers: [HabitsController],
  exports: [HabitsService],
})
export class HabitsModule {}