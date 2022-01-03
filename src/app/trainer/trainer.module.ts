import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainerRoutingModule } from './trainer-routing.module';
import { CoursesComponent } from './pages/courses/courses.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CoursesComponent
  ],
  imports: [
    CommonModule,
    TrainerRoutingModule,
    SharedModule
  ]
})
export class TrainerModule { }
