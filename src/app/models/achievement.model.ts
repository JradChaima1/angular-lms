export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  requiredCount: number;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  currentProgress: number;
}
