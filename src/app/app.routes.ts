import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ManageCoursesComponent } from './components/admin/manage-courses/manage-courses.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'quiz/:lessonId', component: QuizComponent },
      { path: 'courses/:id', component: CourseDetailComponent },
      { path: 'achievements', component: AchievementsComponent },
      { path: 'profile', component: ProfileComponent },
      // Add admin routes here
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          { path: '', component: AdminDashboardComponent },
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'courses', component: ManageCoursesComponent } 
        ]
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
