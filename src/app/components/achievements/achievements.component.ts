import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService } from '../../services/achievement.service';
import { Achievement } from '../../models/achievement.model';
import { IconsModule } from '../../shared/icons.module';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, IconsModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})
export class AchievementsComponent implements OnInit {
  achievements: Achievement[] = [];
  isLoading: boolean = true;
  selectedCategory: string = 'ALL';
  
  categories = [
    { value: 'ALL', label: 'All', icon: 'trophy' },
    { value: 'COURSE', label: 'Courses', icon: 'book-open' },
    { value: 'QUIZ', label: 'Quizzes', icon: 'file-text' },
    { value: 'PERFECT', label: 'Perfect', icon: 'star' },
    { value: 'COMPLETED', label: 'Completed', icon: 'check-circle' }
  ];

  constructor(private achievementService: AchievementService) {}

  ngOnInit(): void {
    this.loadAchievements();
  }

  loadAchievements(): void {
    this.achievementService.getMyAchievements().subscribe({
      next: (achievements) => {
        this.achievements = achievements;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading achievements:', error);
        this.isLoading = false;
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
  }

  getFilteredAchievements(): Achievement[] {
    if (this.selectedCategory === 'ALL') {
      return this.achievements;
    }
    return this.achievements.filter(a => a.category === this.selectedCategory);
  }

  getUnlockedCount(): number {
    return this.achievements.filter(a => a.unlocked).length;
  }

  getTotalPoints(): number {
    return this.achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);
  }

  getProgressPercentage(achievement: Achievement): number {
    return Math.min((achievement.currentProgress / achievement.requiredCount) * 100, 100);
  }
}
