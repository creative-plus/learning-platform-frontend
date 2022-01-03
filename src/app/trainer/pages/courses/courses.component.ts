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

  courseSubscription!: Subscription;
  courses!: Course[];

  ngOnInit(): void {
    this.courseSubscription = this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  ngOnDestroy(): void {
    this.courseSubscription.unsubscribe();
  }

}
