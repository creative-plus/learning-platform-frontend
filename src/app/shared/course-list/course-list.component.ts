import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/lib/models/course/Course';
import { UserType } from 'src/app/lib/models/user/UserType';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() courses!: Course[];
  @Input() perspective: UserType = 'trainer';

  editCourse(courseId: number) {

  }

  deleteCourse(courseId: number) {

  }

}
