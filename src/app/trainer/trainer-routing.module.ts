import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseViewerComponent } from '../shared/course-viewer/course-viewer.component';
import { LeaderboardComponent } from '../shared/leaderboard/leaderboard.component';
import { CourseEditorComponent } from './pages/course-editor/course-editor.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TraineesComponent } from './pages/trainees/trainees.component';

const routes: Routes = [
  {
    path: 'courses',
    component: CoursesComponent,
  },
  {
    path: 'courses/new',
    component: CourseEditorComponent,
  },
  {
    path: 'courses/:id',
    component: CourseEditorComponent,
  },
  {
    path: 'courses/:id/edit',
    component: CourseEditorComponent,
  },
  {
    path: 'courses/:id/view',
    component: CourseViewerComponent,
    data: { useMockService: true, hideToolbar: true, hideDrawer: true }
  },
  {
    path: 'projects',
    component: ProjectsComponent,
  },
  {
    path: 'trainees',
    component: TraineesComponent,
  },
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    data: { title: "Leaderboard" }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainerRoutingModule { }
