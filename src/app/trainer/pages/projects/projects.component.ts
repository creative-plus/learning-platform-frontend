import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Project } from 'src/app/lib/models/Project';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectEditorComponent } from '../../dialogs/project-editor/project-editor.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  constructor(private projectService: ProjectService, private dialog: MatDialog) { }

  projects: Project[];
  isLoadingResults: boolean = true;
  projectSubscription!: Subscription;

  performedActions: BehaviorSubject<string> = new BehaviorSubject(''); // put in merge to force update after student edit

  displayedColumns = ["id", "name", "startDate", "endDate", "actions"];

  ngOnInit(): void {
    this.projectSubscription = this.performedActions.pipe(
      switchMap(_ => {
        this.isLoadingResults = true;
        return this.projectService.getProjects();
      })
    ).subscribe(projects => {
      this.projects = projects;
      this.isLoadingResults = false;
    })
  }

  ngOnDestroy(): void {
    this.projectSubscription.unsubscribe();
  }

  addProject() {
    this.dialog.open(ProjectEditorComponent, {
      data: {
        mode: "create"
      }
    }).afterClosed().subscribe(result => {
      if(result) this.refreshResults();
    });
  }

  editProject(project: Project) {
    this.dialog.open(ProjectEditorComponent, {
      data: {
        mode: "edit",
        project
      }
    }).afterClosed().subscribe(result => {
      if(result) this.refreshResults();
    });
  }

  deleteProject(project: Project) {
    this.dialog.open(ProjectEditorComponent, {
      data: {
        mode: "delete",
        project
      }
    }).afterClosed().subscribe(result => {
      if(result) this.refreshResults();
    });
  }

  refreshResults() {
    this.performedActions.next("refresh");
  }

}
