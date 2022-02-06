import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Course } from 'src/app/lib/models/course/Course';
import { CourseSection } from 'src/app/lib/models/course/course-sections/CourseSection';
import { CourseSectionType } from 'src/app/lib/models/course/course-sections/CourseSectionType';
import { Learning } from 'src/app/lib/models/course/course-sections/Learning';
import { Quiz } from 'src/app/lib/models/course/course-sections/quiz/Quiz';
import { QuizQuestion } from 'src/app/lib/models/course/course-sections/quiz/QuizQuestion';
import { QuizQuestionAnswer } from 'src/app/lib/models/course/course-sections/quiz/QuizQuestionAnswer';
import { ArrayLenghtValidator } from 'src/app/lib/validators/ArrayLengthValidator';
import { copyObject } from 'src/app/lib/util';
import { CourseService } from 'src/app/services/course.service';
import { CourseViewMockService } from 'src/app/services/course-view-mock.service';
import { MediaService } from 'src/app/services/media.service';

import Quill from 'quill'

import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageResize', ImageResize)

@Component({
  selector: 'app-course-editor',
  templateUrl: './course-editor.component.html',
  styleUrls: ['./course-editor.component.scss'],
  
})
export class CourseEditorComponent implements OnInit {

  constructor(private route: ActivatedRoute, private courseService: CourseService, private router: Router,
    private snackbar: MatSnackBar, private courseViewMockService: CourseViewMockService,
    private mediaService: MediaService) { 
      this.modules = {
        imageResize: {},
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'align': [] }],
          ['link', 'image']
        ]
      }
  }

  modules = {};

  initialCourse!: Course | null;
  courseId!: number | null;

  selectedSectionIndex = 0;

  courseStates: FormValue[] = [];
  currentCourseStateIndex: number | null;
  courseValueChangesSubscription!: Subscription;
  providingCourseView: boolean = false;
  courseViewWindow: Window = null;
  courseMockId: number | null = null;
  

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

  addSection(section?: CourseSection, atIndex?: number): void {
    const sectionFormGroup = new FormGroup({
      id: new FormControl(section?.id),
      title: new FormControl(section?.title, [Validators.required]),
      type: new FormControl(section?.type || "learning", [Validators.required]),
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
    if(atIndex != null) {
      this.courseFormSections.insert(atIndex, sectionFormGroup);
    } else {
      this.courseFormSections.push(sectionFormGroup);
    }
  }

  addQuizQuestion(question?: QuizQuestion, formArray?: FormArray) {
    const questionFormGroup = new FormGroup({
      text: new FormControl(question?.text, [Validators.required]),
      multipleAnswer: new FormControl(question?.multipleAnswer),
      answers: new FormArray([], [ArrayLenghtValidator({ min: 2, max: 6 })])
    });
    // Create a question with at least two answers 
    (question?.answers || [null, null]).forEach(answer => 
      this.addQuizQuestionAnswer(answer, questionFormGroup.get("answers") as FormArray));

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
    (this.initialCourse?.sections || [null]).sort((a, b) => a?.order - b?.order)
      .forEach(section => this.addSection(section));

    this.selectedSectionIndex = 0;
    this.currentCourseStateIndex = null;
    this.courseStates.push(this.courseForm.value);
    this.subscribeToValueChanges(this.courseForm);
  }

  sectionDrop(event: CdkDragDrop<SectionLike[]>) {
    const section = this.courseFormSections.get(event.previousIndex.toString());
    this.courseFormSections.insert(event.currentIndex, section, { emitEvent: false });
    const toRemove = event.currentIndex < event.previousIndex ? event.previousIndex + 1 : event.previousIndex;
    this.courseFormSections.removeAt(toRemove);
  }

  getQuizQuestions(section: AbstractControl) {
    return (section.get('typeForm.questions') as FormArray);
  }

  getQuizQuestionAnswers(question: AbstractControl) {
    return (question.get('answers') as FormArray);
  }

  changeSectionType(sectionIndex: number, type: string) {
    const sectionFormGroup = this.courseFormSections.controls[sectionIndex] as FormGroup;
    sectionFormGroup.removeControl("typeForm");
    if(type == 'learning') {
      const learningForm = new FormGroup({
        content: new FormControl("", [Validators.required])
      });
      sectionFormGroup.addControl("typeForm", learningForm);
    } else {
      const quizForm = new FormGroup({
        questions: new FormArray([], [ArrayLenghtValidator({ min: 1, max: 10 })])
      });
      this.addQuizQuestion(null, quizForm.get("questions") as FormArray);
      sectionFormGroup.addControl("typeForm", quizForm);
    }
  }

  removeSection(sectionIndex: number) {
    this.courseFormSections.removeAt(sectionIndex);
    const newSelected = sectionIndex - 1;
    this.selectedSectionIndex = newSelected >= 0 ? newSelected : 0;

    this.addFormState(this.courseForm);
    this.subscribeToValueChanges(this.courseForm);

    this.snackbar.open("Section removed.", "Undo").onAction().subscribe(_ => this.undoAction());
  }

  duplicateSection(sectionIndex: number) {
    let section = this.courseFormSections.controls[sectionIndex].value as any;
    section = { ...section, ...section.typeForm };
    delete section.typeForm;
    delete section.id;
    this.addSection(section, sectionIndex + 1);
    this.selectedSectionIndex = sectionIndex + 1;
  }

  subscribeToValueChanges(courseForm: FormGroup) {
    this.courseValueChangesSubscription?.unsubscribe();
    this.courseValueChangesSubscription = courseForm.valueChanges
      .pipe(
        debounceTime(1000)
      )
      .subscribe(_ => {
        this.addFormState(courseForm);
        this.putToMock();
      });
  }

  addFormState(courseForm: FormGroup) {
    if(this.currentCourseStateIndex != null) {
      const deleteCount = this.courseStates.length - this.currentCourseStateIndex;
      this.courseStates.splice(this.currentCourseStateIndex + 1, deleteCount);
    }
    this.courseStates.push(courseForm.value);
    this.currentCourseStateIndex = null;
  }

  private putToMock() {
    if(!this.providingCourseView) return 0;
    const course = this.formValueToCourse(this.courseForm.value);
    return this.courseViewMockService.putMockCourse(course, this.courseId || this.courseMockId);
  }

  viewCourse() {
    this.providingCourseView = true;
    this.courseMockId = this.putToMock();
    const windowRef = this.courseViewWindow;
    if(!windowRef || windowRef.closed || typeof windowRef.closed == "undefined") {
      this.courseViewWindow = window.open(`/trainer/courses/${this.courseMockId}/view`);
    } else {
      windowRef.focus();
    }
  }

  undoAction() {
    const newIndex = this.currentCourseStateIndex == null ? this.courseStates.length - 2 : this.currentCourseStateIndex - 1;
    if(newIndex < 0) return;
    this.currentCourseStateIndex = newIndex;
    this.safeSetFormValue(this.courseStates[newIndex]);
  }

  redoAction() {
    if(!this.canRedo) return;
    const newIndex = this.currentCourseStateIndex + 1;
    this.currentCourseStateIndex = newIndex;
    this.safeSetFormValue(this.courseStates[newIndex]);
  }

  addSectionBelow() {
    let index = this.courseFormSections.controls.length - 1;
    if(this.selectedSectionIndex != null) {
      index = this.selectedSectionIndex + 1;
    }
    if(index < 0) index = 0;
    this.addSection(null, index);
  }
  
  setSelectedSection(sectionIndex: number, event: Event) {
    event.stopPropagation();
    this.selectedSectionIndex = sectionIndex;
  }

  safeSetFormValue(value: FormValue) {
    const course = this.formValueToCourse(value);
    this.courseForm = new FormGroup({
      name: new FormControl(course?.name, [Validators.required]),
      description: new FormControl(course?.description, [Validators.maxLength(255)]),
      sections: new FormArray([], [ArrayLenghtValidator({ min: 1 })])
    });
    course?.sections?.sort((a, b) => a.order - b.order)
      .forEach(section => this.addSection(section));
    
    this.subscribeToValueChanges(this.courseForm);
  }

  formValueToCourse(value: FormValue): Course {
    const newValue = copyObject(value);
    newValue.sections = newValue.sections.map((formSection, order) => {
      const section = { ...formSection, ...formSection.typeForm, order };
      delete section.typeForm;
      return section;
    });
    return newValue;
  }

  saveCourse() {
    const course = this.formValueToCourse(this.courseForm.value);
    const action = isNaN(this.courseId) ? this.courseService.addCourse(course) : this.courseService.editCourse(this.courseId, course);
    console.log(course);
    return;
    action.subscribe((course) => {
      if(course) {
        this.snackbar.open("Course saved.");
        this.initialCourse = course;
        this.courseId = course.id;
      }
    });
  }

  get canUndo() {
    return (this.currentCourseStateIndex == null ? this.courseStates.length - 2 : this.currentCourseStateIndex - 1) >= 0;
  }

  get canRedo() {
    return this.currentCourseStateIndex != null && this.currentCourseStateIndex + 1 < this.courseStates.length;
  }

  get canRemoveSections() {
    return this.courseFormSections?.controls.length > 1;
  }

  exit() {
    this.router.navigate(["trainer", "courses"]);
  }
}

interface FormValue {
  name: string;
  description: string;
  sections: SectionLike[];
}

interface SectionLike extends CourseSection {
  title: string;
  type: CourseSectionType;
  typeForm: Learning | Quiz;
}


