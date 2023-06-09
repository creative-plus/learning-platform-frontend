import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Trainee, TraineeRequest } from 'src/app/lib/models/user/Trainee';
import { ProjectService } from 'src/app/services/project.service';
import { TraineeService } from 'src/app/services/trainee.service';

@Component({
  selector: 'app-trainee-editor',
  templateUrl: './trainee-editor.component.html',
  styleUrls: ['./trainee-editor.component.scss']
})
export class TraineeEditorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: TraineeEditorDialogData, 
    private traineeService: TraineeService, private projectService: ProjectService,
    private dialogRef: MatDialogRef<TraineeEditorComponent>, private snackbar: MatSnackBar) { }

  isLoadingQuery: boolean = false;

  projects = this.projectService.getProjects();

  traineeForm = new FormGroup({
    id: new FormControl(this.data.trainee?.id),
    firstName: new FormControl(this.data.trainee?.firstName, [Validators.required]),
    lastName: new FormControl(this.data.trainee?.lastName, [Validators.required]),
    email: new FormControl(this.data.trainee?.email, [Validators.required]),
    phoneNumber: new FormControl(this.data.trainee?.phoneNumber),
    country: new FormControl(this.data.trainee?.country, [Validators.required]),
    birthDate: new FormControl(this.data.trainee?.birthDate, [Validators.required]),
    projectIds: new FormControl(this.data.trainee?.projects?.map(p => p.id) || [], [Validators.required])
  });

  get countries() {
    return ["RO", "FR"];
  }
  
  ngOnInit(): void {
    if(this.data.mode == 'edit') {
      this.traineeForm.get("email").disable();
    }
  }

  saveTrainee() {
    const trainee = this.traineeForm.value as TraineeRequest;
    trainee.email = this.traineeForm.get("email").value;
    const action = this.data.mode == 'create' ? this.traineeService.addTrainee(trainee) : this.traineeService.editTrainee(trainee);
    this.isLoadingQuery = true;
    action.subscribe(result => this.checkActionSuccessful(result));
  }

  deleteTrainee() {
    this.isLoadingQuery = true;
    this.traineeService.deleteTrainee(this.data.trainee as any).subscribe(result => this.checkActionSuccessful(result));
  }

  private checkActionSuccessful(result: any) {
    if(result) {
      this.dialogRef.close(true);
    } else {
      this.isLoadingQuery = false;
    }
  }

}

export interface TraineeEditorDialogData {
  mode: 'create' | 'edit' | 'delete';
  trainee?: Trainee
}
