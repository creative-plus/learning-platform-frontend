import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Trainee } from 'src/app/lib/models/user/Trainee';
import { TraineeService } from 'src/app/services/trainee.service';
import { TraineeEditorComponent } from '../../dialogs/trainee-editor/trainee-editor.component';

@Component({
  selector: 'app-trainees',
  templateUrl: './trainees.component.html',
  styleUrls: ['./trainees.component.scss']
})
export class TraineesComponent implements OnInit {

  constructor(private traineeService: TraineeService, private dialog: MatDialog) { }

  trainees: Trainee[];
  isLoadingResults: boolean = true;
  traineeSubscription!: Subscription;

  performedActions: BehaviorSubject<string> = new BehaviorSubject('');

  displayedColumns = ["id", "firstName", "lastName", "email", "phoneNumber", "country", "actions"];

  ngOnInit(): void {
    this.traineeSubscription = this.performedActions.pipe(
      switchMap(_ => {
        this.isLoadingResults = true;
        return this.traineeService.getTrainees();
      })
    ).subscribe(trainees => {
      this.trainees = trainees;
      this.isLoadingResults = false;
    });
  }

  addTrainee() {
    this.dialog.open(TraineeEditorComponent, {
      data: {
        mode: "create"
      }
    }).afterClosed().subscribe(result => {
      if(result) this.refreshResults();
    });
  }

  editTrainee(trainee: Trainee) {
    this.dialog.open(TraineeEditorComponent, {
      data: {
        mode: "edit",
        trainee
      }
    }).afterClosed().subscribe(result => {
      if(result) this.refreshResults();
    });
  }

  deleteTrainee(trainee: Trainee) {
    this.dialog.open(TraineeEditorComponent, {
      data: {
        mode: "delete",
        trainee
      }
    }).afterClosed().subscribe(result => {
      if(result) this.refreshResults();
    });
  }

  refreshResults() {
    this.performedActions.next("refresh");
  }

}
