import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainerRoutingModule } from './trainer-routing.module';
import { CoursesComponent } from './pages/courses/courses.component';
import { SharedModule } from '../shared/shared.module';
import { CourseEditorComponent } from './pages/course-editor/course-editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    CoursesComponent,
    CourseEditorComponent
  ],
  imports: [
    CommonModule,
    TrainerRoutingModule,
    SharedModule,
    DragDropModule,
    MatSlideToggleModule,
    AngularEditorModule
  ]
})
export class TrainerModule { }
