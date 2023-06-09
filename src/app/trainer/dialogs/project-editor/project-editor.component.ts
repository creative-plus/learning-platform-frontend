import { Component, Inject, OnInit } from '@angular/core';
import { Project } from 'src/app/lib/models/Project';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GreaterThanValidator } from 'src/app/lib/validators/GreaterThanValidator';


@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss']
})
export class ProjectEditorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProjectEditorDialogData, private projectService: ProjectService,
    private dialogRef: MatDialogRef<ProjectEditorComponent>, private snackbar: MatSnackBar) { }


  isLoadingQuery: boolean = false;

  ngOnInit(): void {
  }

  projectForm = new FormGroup(
    {
      "id": new FormControl(this.data.project?.id),
      "name": new FormControl(this.data.project?.name, [Validators.required]),
      "description": new FormControl(this.data.project?.description, [Validators.maxLength(255)]),
      "startDate": new FormControl(this.data.project?.startDate, [Validators.required]),
      "endDate": new FormControl(this.data.project?.endDate, [Validators.required]),
      "totalBudget": new FormControl(this.data.project?.totalBudget, [Validators.required, Validators.min(0)]),
      "financeMean": new FormControl(this.data.project?.financeMean, [Validators.required]),
      "minAge": new FormControl(this.data.project?.minAge, [Validators.required, Validators.min(0)]),
      "maxAge": new FormControl(this.data.project?.maxAge, [Validators.required, Validators.min(0)]),
    }, 
    [ GreaterThanValidator("endDate", "startDate", "startDateGreater") ]
  );

  saveProject() {
    const project = this.projectForm.value as Project;
    const action = this.data.mode == 'create' ? this.projectService.addProject(project) : this.projectService.editProject(project);
    this.isLoadingQuery = true;
    action.subscribe(result => this.checkActionSuccessful(result));
  }

  deleteProject() {
    this.isLoadingQuery = true;
    this.projectService.deleteProject(this.data.project).subscribe(result => this.checkActionSuccessful(result));
  }

  private checkActionSuccessful(result: any) {
    if(result) {
      this.dialogRef.close(true);
    } else {
      this.isLoadingQuery = false;
    }
  }

}

export interface ProjectEditorDialogData {
  mode: 'create' | 'edit' | 'delete';
  project?: Project
}
