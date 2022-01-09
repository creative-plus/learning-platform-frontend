import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { LeaderboardTrainee } from 'src/app/lib/models/LeaderboardTrainee';
import { CourseService } from 'src/app/services/course.service';
import { GetLeaderboardOptions, LeaderboardService } from 'src/app/services/leaderboard.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  constructor(private leaderboardService: LeaderboardService, 
    private projectService: ProjectService, private courseService: CourseService) { }

  leaderboardSubscription!: Subscription;

  leaderboard: LeaderboardTrainee[] = [];

  leaderboardOptionsForm = new FormGroup({
    projectId: new FormControl(""),
    courseId: new FormControl("")
  });

  displayedColumns: string[] = ["index", "name", "points"];
  isLoadingResults: boolean = false;

  projects = this.projectService.getProjects();
  courses = this.courseService.getAllCourses();

  ngOnInit(): void {
    this.leaderboardSubscription = this.leaderboardOptionsForm.valueChanges.pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        const leaderboardOptions = this.leaderboardOptionsForm.value;
        return this.leaderboardService.getLeaderboard(leaderboardOptions)
      })
    ).subscribe(leaderboard => {
      this.isLoadingResults = false;
      this.leaderboard = leaderboard;
    });
  }

}
