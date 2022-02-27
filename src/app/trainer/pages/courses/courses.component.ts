import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course } from 'src/app/lib/models/course/Course';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {

  constructor(private courseService: CourseService, private router: Router) { }

  courseSubscription!: Subscription;
  courses!: Course[];

  ngOnInit(): void {
    this.loadCourses();
  }

  ngOnDestroy(): void {
    this.courseSubscription.unsubscribe();
  }

  addCourse() {
    this.router.navigate(["trainer", "courses", "add"]);
  }

  loadCourses() {
    this.courseSubscription?.unsubscribe();
    this.courseSubscription = this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

}
