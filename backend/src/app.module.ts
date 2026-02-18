import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { AuthModule } from './auth/auth.module';
import { HabitsModule } from './habits/habits.module';
import { UsersModule } from './users/users.module';
import { CompletionsModule } from './completions/completions.module';

import { User } from './users/user.entity';
import { Habit } from './habits/habit.entity';
import { Completion } from './completions/completion.entity';

@Module({
  imports: [
    // Load and validate environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        PORT: Joi.number().default(3001),
        FRONTEND_URL: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRES_IN: Joi.string().default('7d'),
        DB_PATH: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: false, // show all validation errors
      },
    }),

    // Database connection (SQLite with better-sqlite3)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3' as const,
        database: config.get<string>('DB_PATH')!,
        entities: [User, Habit, Completion],
        synchronize: true, // ← set to false in real production after migrations
        logging: config.get('NODE_ENV') === 'development', // helpful for dev
      }),
      inject: [ConfigService],
    }),

    // Your feature modules
    AuthModule,
    UsersModule,
    HabitsModule,
    CompletionsModule,
  ],
})
export class AppModule {}