import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TraineeRoutingModule } from './trainee-routing.module';
import { CoursesComponent } from './pages/courses/courses.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CoursesComponent
  ],
  imports: [
    CommonModule,
    TraineeRoutingModule,
    SharedModule,
  ]
})
export class TraineeModule { }
