import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CourseProgress } from 'src/app/lib/models/CourseProgress';
import { Trainee } from 'src/app/lib/models/user/Trainee';
import { TraineeService } from 'src/app/services/trainee.service';

@Component({
  selector: 'app-trainee-progress',
  templateUrl: './trainee-progress.component.html',
  styleUrls: ['./trainee-progress.component.scss']
})
export class TraineeProgressComponent implements OnInit, OnDestroy {

  constructor(private traineeService: TraineeService) { }

  progressSubscription!: Subscription;

  trainees: Trainee[] = [];
  courseProgresses: CourseProgress[] = [];

  ngOnInit(): void {
    this.progressSubscription = this.traineeService.getTrainees().pipe(
      switchMap(trainees => {
        this.trainees = trainees;
        return this.traineeService.getProgress(trainees[0].id);
      })
    ).subscribe(result => {
      this.courseProgresses = result;
    });
  }

  ngOnDestroy(): void {
    this.progressSubscription.unsubscribe();
  }

}
