import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HabitsModule } from './habits/habits.module';
import { UsersModule } from './users/users.module';
import { CompletionsModule } from './completions/completions.module';
import { User } from './users/user.entity';
import { Habit } from './habits/habit.entity';
import { Completion } from './completions/completion.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3',
        database: config.get('DB_PATH', './habitnow.db'),
        entities: [User, Habit, Completion],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    HabitsModule,
    CompletionsModule,
  ],
})
export class AppModule {}
