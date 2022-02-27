import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/lib/models/course/Course';
import { UserType } from 'src/app/lib/models/user/UserType';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  constructor(private router: Router, private courseService: CourseService) { }

  ngOnInit(): void {
  }

  @Input("courses") _courses!: Course[];
  @Input() perspective: UserType = 'trainer';
  @Output() reload: EventEmitter<void> = new EventEmitter<void>();

  get courses() {
    return this._courses as EnrichedCourse[];
  }

  editCourse(courseIndex: number) {
    this.router.navigate(["/trainer", "courses", this.courses[courseIndex].id])
  }

  deleteCourse(courseIndex: number) {
    if(!confirm("Are you sure you want to delete this course?")) return;
    const course = this.courses[courseIndex];
    course.loading = true;
    this.courseService.deleteCourse(course.id).subscribe(res => {
      if(res) {
        this.reload.emit();
      } else {
        course.loading = false;
      }
    })
  }

  seeLeaderboard(courseIndex: number) {
    const course = this.courses[courseIndex];
    this.router.navigate(["trainer", "leaderboard"], {
      queryParams: { courseId: course.id }
    });
  }

  enrollToCourse(courseIndex: number) {
    const course = this.courses[courseIndex];
    course.loading = true;
    this.courseService.enrollToCourse(course.id).subscribe(registration => {
      if(registration) {
        this.resumeCourse(courseIndex);
      } else {
        course.loading = false;
      }
    })
  }

  resumeCourse(courseIndex: number) {
    this.router.navigate(["/trainee", "courses", this.courses[courseIndex].id])
  }

}

interface EnrichedCourse extends Course {
  loading: boolean;
} 
