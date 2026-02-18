import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CommonModule  } from '@angular/common';
import { HabitsService, Habit } from '../../core/services/habits.service';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [RouterLink, DatePipe, CommonModule],
  template: `
    <div class="today-page">
      <!-- Date Header -->
      <div class="date-header">
        <div class="date-nav">
          <button class="nav-btn" (click)="changeDate(-1)">‹</button>
          <div class="date-info">
            <span class="date-label">{{ isToday() ? 'Today' : '' }}</span>
            <span class="date-text">{{ currentDate() | date:'EEEE, MMMM d' }}</span>
          </div>
          <button class="nav-btn" (click)="changeDate(1)" [disabled]="isToday()">›</button>
        </div>

        <!-- Progress Ring -->
        <div class="progress-section">
          <div class="progress-ring-wrap">
            <svg viewBox="0 0 80 80" class="ring-svg">
              <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" stroke-width="8"/>
              <circle
                cx="40" cy="40" r="32" fill="none"
                stroke="var(--primary)" stroke-width="8"
                stroke-linecap="round"
                [style.stroke-dasharray]="'201'"
                [style.stroke-dashoffset]="dashOffset()"
                transform="rotate(-90 40 40)"
                style="transition: stroke-dashoffset 0.5s ease"
              />
            </svg>
            <div class="ring-count">
              <span class="ring-done">{{ completedCount() }}</span>
              <span class="ring-sep">/</span>
              <span class="ring-total">{{ habits().length }}</span>
            </div>
          </div>
          <div class="progress-label">
            @if (habits().length === 0) {
              <span>No habits yet</span>
            } @else if (completedCount() === habits().length) {
              <span class="done-label">All done! 🎉</span>
            } @else {
              <span>{{ habits().length - completedCount() }} remaining</span>
            }
          </div>
        </div>
      </div>

    <!-- Time Sections -->
    @if (loading()) {
    <div class="loading">Loading habits...</div>
    } @else if (habits().length === 0) {
    <div class="empty-state">
        <div class="empty-icon">🌱</div>
        <h3>No habits yet</h3>
        <p>Start building your routine by adding your first habit.</p>
        <a routerLink="/habits/new" class="btn-primary">+ Add First Habit</a>
    </div>
    } @else {
    @for (section of timeSections; track section.key) {
        @if (getHabitsByTime(section.key).length > 0) {
        <div class="time-section">
            <div class="section-header">
            <span class="section-icon">{{ section.icon }}</span>
            <span class="section-title">{{ section.label }}</span>
            </div>
            @for (habit of getHabitsByTime(section.key); track habit.id) {
            <div
                class="habit-card"
                [class.completed]="habit.completedToday"
                [class.bad-habit]="habit.type === 'bad'"
                (click)="toggleHabit(habit)"
            >
                <div class="habit-icon" [style.background]="habit.color || 'var(--primary)'">
                {{ habit.icon || '✅' }}
                </div>
                <div class="habit-body">
                <div class="habit-name">{{ habit.name }}</div>
                @if (habit.description) {
                    <div class="habit-desc">{{ habit.description }}</div>
                }
                <div class="habit-meta">
                    @if (habit.streak && habit.streak > 0) {
                    <span class="streak-badge">🔥 {{ habit.streak }} day streak</span>
                    }
                    @if (habit.type === 'bad') {
                    <span class="bad-badge">Break habit</span>
                    }
                </div>
                </div>
                <div class="habit-check" [class.checked]="habit.completedToday">
                {{ habit.completedToday ? '✓' : '' }}
                </div>
            </div>
            }
        </div>
        }
    }
    }

      <!-- FAB -->
      <a routerLink="/habits/new" class="fab">+</a>
    </div>
  `,
  styles: [`
    .today-page { padding: 0 0 80px; max-width: 600px; margin: 0 auto; }

    .date-header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .date-nav {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .nav-btn {
      background: none;
      border: 1.5px solid var(--border);
      width: 32px;
      height: 32px;
      border-radius: 8px;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .nav-btn:hover:not(:disabled) { background: var(--bg); }
    .nav-btn:disabled { opacity: 0.3; cursor: default; }
    .date-info { flex: 1; }
    .date-label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em; }
    .date-text { font-size: 1rem; font-weight: 600; color: var(--text); }

    .progress-section { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .progress-ring-wrap { position: relative; width: 64px; height: 64px; }
    .ring-svg { width: 100%; height: 100%; }
    .ring-count {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text);
    }
    .ring-sep { color: var(--text-muted); margin: 0 1px; }
    .progress-label { font-size: 0.72rem; color: var(--text-muted); text-align: center; }
    .done-label { color: var(--primary); font-weight: 700; }

    .loading, .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-muted);
    }
    .empty-icon { font-size: 3rem; margin-bottom: 12px; }
    .empty-state h3 { color: var(--text); margin: 0 0 8px; font-size: 1.2rem; }
    .empty-state p { font-size: 0.9rem; margin-bottom: 24px; }
    .btn-primary {
      display: inline-block;
      padding: 12px 24px;
      background: var(--primary);
      color: white;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
    }

    .time-section { padding: 16px 16px 0; }
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      padding: 0 4px;
    }
    .section-icon { font-size: 1.1rem; }
    .section-title { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }

    .habit-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: 14px;
      padding: 14px 16px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
    }
    .habit-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .habit-card.completed {
      background: var(--primary-light);
      border-color: var(--primary);
      opacity: 0.85;
    }
    .habit-card.bad-habit { border-color: var(--danger-light, #ffd6d6); }
    .habit-card.bad-habit.completed { background: var(--danger-light, #ffd6d6); border-color: var(--danger); }

    .habit-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      flex-shrink: 0;
      color: white;
    }
    .habit-body { flex: 1; min-width: 0; }
    .habit-name {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .habit-desc { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }
    .habit-meta { display: flex; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
    .streak-badge {
      font-size: 0.72rem;
      color: #f97316;
      font-weight: 600;
      background: #fff7ed;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .bad-badge {
      font-size: 0.72rem;
      color: var(--danger);
      font-weight: 600;
      background: #fff0f0;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .habit-check {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      color: white;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .habit-check.checked {
      background: var(--primary);
      border-color: var(--primary);
      font-weight: 700;
    }

    .fab {
      position: fixed;
      bottom: 76px;
      right: 20px;
      width: 56px;
      height: 56px;
      background: var(--primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      text-decoration: none;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      transition: transform 0.2s;
      line-height: 1;
    }
    .fab:hover { transform: scale(1.1); }
  `],
})
export class TodayComponent implements OnInit {
  habits = signal<Habit[]>([]);
  loading = signal(true);
  private _currentDate = signal(new Date());

  timeSections = [
    { key: 'morning', label: 'Morning', icon: '🌅' },
    { key: 'afternoon', label: 'Afternoon', icon: '☀️' },
    { key: 'evening', label: 'Evening', icon: '🌙' },
    { key: 'anytime', label: 'Anytime', icon: '⏰' },
  ];

  constructor(private habitsService: HabitsService) {}

  ngOnInit() {
    this.loadHabits();
  }

  currentDate() {
    return this._currentDate();
  }

  isToday() {
    const now = new Date();
    const d = this._currentDate();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }

  changeDate(delta: number) {
    const d = new Date(this._currentDate());
    d.setDate(d.getDate() + delta);
    if (d > new Date()) return;
    this._currentDate.set(d);
    this.loadHabits();
  }

  loadHabits() {
    this.loading.set(true);
    const dateStr = this._currentDate().toISOString().split('T')[0];
    this.habitsService.getTodayHabits(dateStr).subscribe({
      next: (h) => {
        this.habits.set(h);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getHabitsByTime(time: string): Habit[] {
    return this.habits().filter((h) => (h.timeOfDay || 'anytime') === time);
  }

  completedCount() {
    return this.habits().filter((h) => h.completedToday).length;
  }

  dashOffset() {
    const total = this.habits().length;
    if (total === 0) return 201;
    const pct = this.completedCount() / total;
    return 201 - pct * 201;
  }

  toggleHabit(habit: Habit) {
    const dateStr = this._currentDate().toISOString().split('T')[0];
    this.habitsService.toggleCompletion(habit.id, dateStr).subscribe((res) => {
      this.habits.update((habits) =>
        habits.map((h) =>
          h.id === habit.id
            ? { ...h, completedToday: res.completed, streak: res.completed ? (h.streak || 0) + 1 : Math.max(0, (h.streak || 0) - 1) }
            : h,
        ),
      );
    });
  }
}