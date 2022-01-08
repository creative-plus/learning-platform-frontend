import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseViewerComponent } from '../shared/course-viewer/course-viewer.component';
import { CoursesComponent } from './pages/courses/courses.component';

const routes: Routes = [
  {
    path: 'courses',
    component: CoursesComponent,
  },
  {
    path: 'courses/:id',
    component: CourseViewerComponent,
    data: { hideToolbar: true, hideDrawer: true }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraineeRoutingModule { }
