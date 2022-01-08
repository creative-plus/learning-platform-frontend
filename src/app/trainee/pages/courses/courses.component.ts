import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from 'src/app/lib/models/course/Course';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {

  constructor(private courseService: CourseService) { }

  courses: Course[];
  isLoadingResults = false;
  courseSubscription: Subscription;

  ngOnInit(): void {
    this.isLoadingResults = false;
    this.courseSubscription = this.courseService.getAllCoursesWithRegistration().subscribe(courses => {
      this.courses = courses;
      this.isLoadingResults = false;
    });
  }

  ngOnDestroy(): void {
    this.courseSubscription.unsubscribe();
  }

}
