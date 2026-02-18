import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompletionsService } from './completions.service';
import { CompletionsController } from './completions.controller';
import { Completion } from './completion.entity';
import { Habit } from '../habits/habit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Completion, Habit])],
  providers: [CompletionsService],
  controllers: [CompletionsController],
})
export class CompletionsModule {}