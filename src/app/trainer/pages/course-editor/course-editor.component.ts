import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Course } from 'src/app/lib/models/course/Course';
import { CourseSection } from 'src/app/lib/models/course/course-sections/CourseSection';
import { Learning } from 'src/app/lib/models/course/course-sections/Learning';
import { Quiz } from 'src/app/lib/models/course/course-sections/quiz/Quiz';
import { QuizQuestion } from 'src/app/lib/models/course/course-sections/quiz/QuizQuestion';
import { QuizQuestionAnswer } from 'src/app/lib/models/course/course-sections/quiz/QuizQuestionAnswer';
import { ArrayLenghtValidator } from 'src/app/lib/models/validators/ArrayLengthValidator';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-course-editor',
  templateUrl: './course-editor.component.html',
  styleUrls: ['./course-editor.component.scss']
})
export class CourseEditorComponent implements OnInit {

  constructor(private route: ActivatedRoute, private courseService: CourseService, private router: Router) { }

  initialCourse!: Course | null;
  courseId!: number | null;

  courseForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.maxLength(255)]),
    sections: new FormArray([], [ArrayLenghtValidator({ min: 1 })])
  });

  ngOnInit(): void {
    this.route.paramMap
    .pipe(
      switchMap(params => {
        this.courseId = Number(params.get("id"));
        return this.courseId ? this.courseService.getCourse(this.courseId) : of(null);
      })
    ).subscribe(course => {
      if(this.courseId && !course) {
        this.router.navigate(["/trainee", "courses"]);
      } else {
        this.initialCourse = course;
        this.resetForm();
      }
    })
  }

  get courseFormSections() { return this.courseForm.get("sections") as FormArray };

  addSection(section?: CourseSection): void {
    const sectionFormGroup = new FormGroup({
      title: new FormControl(section?.title, [Validators.required]),
      type: new FormControl(section.type || "learning", [Validators.required]),
    });
    if(!section || section.type == 'learning') {
      const learningForm = new FormGroup({
        content: new FormControl((<Learning>section)?.content, [Validators.required])
      });
      sectionFormGroup.addControl("typeForm", learningForm);
    } else {
      const quizForm = new FormGroup({
        questions: new FormArray([], [ArrayLenghtValidator({ min: 1, max: 10 })])
      });
      if(section) {
        (<Quiz>section).questions.forEach(question => 
          this.addQuizQuestion(question, quizForm.get("questions") as FormArray));
      }
      sectionFormGroup.addControl("typeForm", quizForm);
    }
    this.courseFormSections.push(sectionFormGroup);
  }

  addQuizQuestion(question?: QuizQuestion, formArray?: FormArray) {
    const questionFormGroup = new FormGroup({
      text: new FormControl(question?.text, [Validators.required]),
      multipleAnswers: new FormControl(question.multipleAnswer),
      answers: new FormArray([], [ArrayLenghtValidator({ min: 2, max: 6 })])
    });
    if(question) {
      question.answers.forEach(answer => 
        this.addQuizQuestionAnswer(answer, questionFormGroup.get("answers") as FormArray));
    }
    formArray.push(questionFormGroup);
  }

  addQuizQuestionAnswer(answer?: QuizQuestionAnswer, formArray?: FormArray) {
    const answerFormGroup = new FormGroup({
      text: new FormControl(answer?.text, [Validators.required]),
      correct: new FormControl(answer?.correct)
    });
    formArray.push(answerFormGroup);
  }

  resetForm() {
    this.courseForm = new FormGroup({
      name: new FormControl(this.initialCourse?.name, [Validators.required]),
      description: new FormControl(this.initialCourse?.description, [Validators.maxLength(255)]),
      sections: new FormArray([], [ArrayLenghtValidator({ min: 1 })])
    });
    this.initialCourse?.sections?.sort((a, b) => a.order - b.order)
      .forEach(section => this.addSection(section));
    console.log(this.courseForm.value)
  }
}


