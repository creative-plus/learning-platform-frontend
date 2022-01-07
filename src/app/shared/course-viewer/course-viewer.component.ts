import { Component, OnInit } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, merge } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AbstractCourseViewService } from 'src/app/lib/abstract/AbstractCourseViewService';
import { Course } from 'src/app/lib/models/course/Course';
import { CourseSection } from 'src/app/lib/models/course/course-sections/CourseSection';
import { Learning } from 'src/app/lib/models/course/course-sections/Learning';
import { Quiz } from 'src/app/lib/models/course/course-sections/quiz/Quiz';
import { CourseRegistration } from 'src/app/lib/models/course/CourseRegistration';
import { arrayToMap } from 'src/app/lib/util';
import { CourseViewMockService } from 'src/app/services/course-view-mock.service';

@Component({
  selector: 'app-course-viewer',
  templateUrl: './course-viewer.component.html',
  styleUrls: ['./course-viewer.component.scss']
})
export class CourseViewerComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router,
    private mockService: CourseViewMockService) { }

  usedService!: AbstractCourseViewService;
  courseId!: number;
  course!: Course;
  courseRegistration: CourseRegistration;
  isLoadingContent: boolean = false;

  currentSection!: CourseSection;

  drawerMode: MatDrawerMode = "side";


  ngOnInit(): void {
    this.usedService = this.mockService;
    this.route.paramMap
    .pipe(
      switchMap(params => {
        this.courseId = Number(params.get("id"));
        if(!this.courseId) {
          throw "";
        }
        return combineLatest([this.usedService.getCourse(this.courseId), this.usedService.getCourseRegistration(this.courseId)])
      }),
      switchMap(([course, registration]) => {
        if(!course || !registration) {
          throw "";
        }
        this.course = course;
        this.course.sections?.sort((a, b) => a.order - b.order);
        this.courseRegistration = registration;
        return this.usedService.getSection(this.courseId, this.firstUnpassedSection.id);
      }),
    ).subscribe(section => {
      this.currentSection = section;
    })
  }

  goToNextSection() {
    this.isLoadingContent = true;
    this.usedService.passSection(this.courseId, this.currentSection.id).subscribe(result => {
      if(result) {
        this.courseRegistration = result as CourseRegistration;
        const nextSection = this.courseSections.find(section => section.order == this.currentSection.order + 1);
        if(nextSection) {
          this.goToSection(nextSection.id);
        }
      } else {
        this.isLoadingContent = false;
      }
    });
  }

  goToPreviousSection() {
    this.goToSection(this.previousSection.id);
  }

  goToSection(sectionId: number) {
    this.isLoadingContent = true;
    this.usedService.getSection(this.courseId, sectionId).subscribe(section => {
      if(section) {
        this.currentSection = section;
      }
      this.isLoadingContent = false;
    });
  }

  get courseSections(): CourseSectionEnritched[] {
    const sectionMap = arrayToMap<CourseSectionEnritched>(this.course.sections as CourseSectionEnritched[], "id");
    this.courseRegistration.sections.forEach(section => {
      sectionMap[section.id].passed = true;
    });
    return Object.values(sectionMap);
  }

  get firstUnpassedSection() {
    return this.courseSections.find(section => !section.passed) || this.courseSections[0];
  }

  get lastSection() {
    const len = this.courseSections.length;
    if(len == 0) return null;
    return this.courseSections[len - 1];
  }

  get firstSection() {
    if(this.courseSections.length == 0) return null;
    return this.courseSections[0];
  }

  get previousSection() {
    if(!this.currentSection) return null;
    return this.courseSections?.find(section => section.order == this.currentSection.order - 1);
  }

  get nextSection() {
    if(!this.currentSection) return null;
    return this.courseSections?.find(section => section.order == this.currentSection.order + 1);
  }

  get contentSectionLearning() {
    return this.currentSection as Learning;
  }

  get contentSectionQuiz() {
    return this.currentSection as Quiz;
  }

  exit() {
    if(window.opener) {
      window.close();
    } else {
      this.router.navigate(["/trainee", "courses"]);
    }
  }
}

export interface CourseSectionEnritched extends CourseSection {
  passed: boolean;
}
