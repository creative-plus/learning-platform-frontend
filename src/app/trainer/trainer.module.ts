import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainerRoutingModule } from './trainer-routing.module';
import { CoursesComponent } from './pages/courses/courses.component';
import { SharedModule } from '../shared/shared.module';
import { CourseEditorComponent } from './pages/course-editor/course-editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ProjectsComponent } from './pages/projects/projects.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProjectEditorComponent } from './dialogs/project-editor/project-editor.component';
import { TraineesComponent } from './pages/trainees/trainees.component';
import { TraineeEditorComponent } from './dialogs/trainee-editor/trainee-editor.component';
import { TraineeProgressComponent } from './pages/trainee-progress/trainee-progress.component';
import { CourseProgressComponent } from './components/course-progress/course-progress.component';


@NgModule({
  declarations: [
    CoursesComponent,
    CourseEditorComponent,
    ProjectsComponent,
    ProjectEditorComponent,
    TraineesComponent,
    TraineeEditorComponent,
    TraineeProgressComponent,
    CourseProgressComponent
  ],
  imports: [
    CommonModule,
    TrainerRoutingModule,
    SharedModule,
    DragDropModule,
    MatSlideToggleModule,
    AngularEditorModule,
    MatExpansionModule
  ]
})
export class TrainerModule { }
