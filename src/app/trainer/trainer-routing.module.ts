import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseEditorComponent } from './pages/course-editor/course-editor.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { ProjectsComponent } from './pages/projects/projects.component';

const routes: Routes = [
  {
    path: 'courses',
    component: CoursesComponent,
  },
  {
    path: 'courses/:id',
    component: CourseEditorComponent,
  },
  {
    path: 'courses/new',
    component: CourseEditorComponent,
  },
  {
    path: 'projects',
    component: ProjectsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainerRoutingModule { }
