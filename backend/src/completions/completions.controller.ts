import {
  Controller, Post, Get, Param, Query, UseGuards, Request, ParseIntPipe
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompletionsService } from './completions.service';

@UseGuards(JwtAuthGuard)
@Controller('completions')
export class CompletionsController {
  constructor(private completionsService: CompletionsService) {}

  @Post('toggle/:habitId')
  toggle(
    @Param('habitId', ParseIntPipe) habitId: number,
    @Query('date') date: string,
    @Request() req,
  ) {
    return this.completionsService.toggle(habitId, req.user.id, date);
  }

  @Get('history/:habitId')
  getHistory(
    @Param('habitId', ParseIntPipe) habitId: number,
    @Query('days') days: string,
    @Request() req,
  ) {
    return this.completionsService.getHistory(habitId, req.user.id, days ? +days : 30);
  }

  @Get('stats/month')
  getMonthStats(
    @Query('year') year: string,
    @Query('month') month: string,
    @Request() req,
  ) {
    const now = new Date();
    return this.completionsService.getMonthStats(
      req.user.id,
      year ? +year : now.getFullYear(),
      month ? +month : now.getMonth() + 1,
    );
  }
}