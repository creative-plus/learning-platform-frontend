import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractCourseViewService, QuizWrongAnswerResponse } from '../lib/abstract/AbstractCourseViewService';
import { Course } from '../lib/models/course/Course';
import { CourseSection } from '../lib/models/course/course-sections/CourseSection';
import { Quiz } from '../lib/models/course/course-sections/quiz/Quiz';
import { QuizAnswers } from '../lib/models/course/course-sections/quiz/quiz-answers/QuizAnswers';
import { CourseRegistration } from '../lib/models/course/CourseRegistration';

@Injectable({
  providedIn: 'root'
})
export class CourseViewMockService extends AbstractCourseViewService {

  constructor() {
    super();
    window.addEventListener("storage", () => this._getandSetDb());
    this._getandSetDb();
  }

  private _getandSetDb() {
    if(this.justUpdatedDb) {
      this.justUpdatedDb = false;
      return;
    }
    const db = JSON.parse(localStorage.getItem("mockCourses")) || {};
    this.courseMockDb.next(db);
  }

  private justUpdatedDb: boolean = false;

  private courseMockDb: BehaviorSubject<ICourseDb> = new BehaviorSubject({});

  putMockCourse(course: Course, mockId?: number) {
    const db = this.courseMockDb.value;
    const id = mockId || course.id || Date.now(); // current time is enough as ID
    course.id = id;
    db[id] = course;
    this.courseMockDb.next(db);
    this.justUpdatedDb = true;
    localStorage.setItem("mockCourses", JSON.stringify(db));
    return id;
  }

  getCourse(courseId: number): Observable<Course> {
    return this.courseMockDb.asObservable().pipe(
      map(db =>  db[courseId])
    );
  }

  getCourseRegistration(courseId: number): Observable<CourseRegistration> {
    const registration: CourseRegistration = this._getCourseRegistration(courseId);
    return of(registration);
  }

  passSection(courseId: number, sectionId: number, quizAnswers?: QuizAnswers): Observable<CourseRegistration | QuizWrongAnswerResponse> {
    const section = this._getCourseSection(courseId, sectionId);
    if(section.type == "quiz") {
      const badResult = this.checkQuizAnswers(section as Quiz, quizAnswers);
      if(badResult) return of(badResult);
    }
    return of(this._getCourseRegistration(courseId));
  }

  getSection(courseId: number, sectionId: number): Observable<CourseSection> {
    return this.courseMockDb.pipe(
      map(db => db[courseId].sections.find(section => section.id == sectionId))
    );
  }

  private _getCourse(courseId: number) {
    return this.courseMockDb.value[courseId];
  }

  private _getCourseSection(courseId: number, sectionId: number) {
    return this._getCourse(courseId).sections.find(section => section.id == sectionId);
  }

  private _getCourseRegistration(courseId: number) {
    return {
      id: {
        traineeId: null,
        courseId,
      },
      dateStarted: new Date().toISOString(),
      dateFinished: null,
      sections: this._getCourse(courseId).sections
    };
  }

  private checkQuizAnswers(section: Quiz, quizAnswers: QuizAnswers): QuizWrongAnswerResponse | null {
    const questionCorrectAnswers: IQuestionCorrectAnswers = { };
    const correctQuestions: ICorrectQuestions = { };
    section.questions.forEach(question => {
      correctQuestions[question.id] = false;
      questionCorrectAnswers[question.id] = question.answers.filter(answer => answer.correct).map(answer => answer.id);
    });
    quizAnswers.answers.forEach(questionAnswer => {
      const correct = [...questionCorrectAnswers[questionAnswer.questionId]].sort();
      const provided = [...questionAnswer.answerIds].sort();
      correctQuestions[questionAnswer.questionId] = correct.join() == provided.join();
    });
    if(Object.values(correctQuestions).filter(x => !x).length > 0) {
      const response: QuizWrongAnswerResponse = {
        correctQuestionAnswers: correctQuestions
      }
      return response;
    }
    return null;
  }
}

interface IQuestionCorrectAnswers {
  [questionId: number]: number[]; 
}

interface ICorrectQuestions {
  [questionId: number]: boolean
}

interface ICourseDb {
  [id: number]: Course;
}
