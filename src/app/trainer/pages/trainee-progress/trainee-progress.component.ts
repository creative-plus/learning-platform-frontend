import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
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
  selectedTrainee: Trainee;

  progressForm = new FormGroup({
    traineeId: new FormControl(null, [Validators.required])
  });

  ngOnInit(): void {
    this.traineeService.getTrainees().subscribe(trainees => {
      this.trainees = trainees;
      this.progressForm.get("traineeId").setValue(trainees[0].id);
      this.progressSubscription = this.progressForm.valueChanges.pipe(
        startWith({}),
        switchMap(_ => {
          const traineeId = this.progressForm.get("traineeId").value;
          return this.traineeService.getProgress(traineeId);
        })
      ).subscribe(result => {
        this.courseProgresses = result;
      });
    });
  }

  ngOnDestroy(): void {
    this.progressSubscription.unsubscribe();
  }

}
