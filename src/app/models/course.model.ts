
export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price: number;
  enrolled?: boolean;
  lessons?: Lesson[]; 
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  duration: number;
  courseId: number;
  order: number;
  completed: boolean;
  videoUrl?: string;
}
