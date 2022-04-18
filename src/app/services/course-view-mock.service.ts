import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { AbstractCourseViewService, QuizWrongAnswerResponse } from '../lib/abstract/AbstractCourseViewService';
import { Course } from '../lib/models/course/Course';
import { CourseSection } from '../lib/models/course/course-sections/CourseSection';
import { Quiz } from '../lib/models/course/course-sections/quiz/Quiz';
import { QuizAnswers } from '../lib/models/course/course-sections/quiz/quiz-answers/QuizAnswers';
import { CourseRegistration } from '../lib/models/course/CourseRegistration';
import { copyObject, randomInt } from '../lib/util';

@Injectable({
  providedIn: 'root'
})
export class CourseViewMockService extends AbstractCourseViewService {

  constructor() {
    super();
    window.addEventListener("message", this.handleMessage.bind(this));
    window.addEventListener("beforeunload", () => {
      this.listeners.forEach((listener) => listener.window.close());
    });
  }

  sendCourse(courseId: number) {
    const course = this.sourceDb[courseId];
    if(!course) return;
    const listeners = this.listeners.filter(listener => listener.courseId == courseId);
    listeners.forEach(listener => {
      listener.window.postMessage({
        message: "course",
        course
      });
    });
  }

  handleMessage(event: MessageEvent) {
    if(event.origin != window.origin) return;
    const message = event.data?.message;
    if(message == "getCourse") {
      const courseId = event.data?.courseId;
      this.listeners.push({ window: event.source, courseId });
      this.sendCourse(courseId);
    } else if(message == "course") {
      const course = event.data?.course;
      if(course) {
        this._db[course.id] = course;
        this.dbSubject.next(this._db);
      }
    }
  }


  private listeners: ListenerWindow[] = [];

  private sourceDb: ICourseDb = {};

  private _db: ICourseDb = {};

  private dbSubject: ReplaySubject<ICourseDb> = new ReplaySubject(1);
  private mockDb = this.dbSubject.asObservable();

  putMockCourse(course: Course, mockId?: number) {
    const db = this.sourceDb;
    const id = mockId || course.id || Date.now(); // current time is enough as ID
    course.id = id;
    const setCourse = copyObject(course);
    setCourse?.sections?.forEach((section, index) => {
      section.id = section.id || (index + 1);
      if(section.type == 'quiz') {
        (section as Quiz).questions.forEach((question, index) => {
          question.id = question.id || (index + 1);
          question.answers.forEach((answer, index) => {
            answer.id = answer.id || (index + 1);
          });
        });
      }
    });
    db[id] = setCourse;
    this.sendCourse(id);
    return id;
  }

  getCourse(courseId: number): Observable<Course> {
    window.opener.postMessage({
      message: "getCourse",
      courseId
    }, window.origin);
    return this.mockDb.pipe(
      map(db => db[courseId])
    );
  }

  getCourseRegistration(courseId: number): Observable<CourseRegistration> {
    return this.mockDb.pipe(
      map(_ => this._getCourseRegistration(courseId))
    );
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
    return this.dbSubject.pipe(
      map(db => db[courseId].sections.find(section => section.id == sectionId))
    );
  }

  private _getCourse(courseId: number) {
    return this._db[courseId];
  }

  private _getCourseSection(courseId: number, sectionId: number) {
    return this._getCourse(courseId).sections.find(section => section.id == sectionId);
  }

  private _getCourseRegistration(courseId: number) {
    const course = this._getCourse(courseId)
    if(!course) return null;
    return {
      id: {
        traineeId: null,
        courseId,
      },
      dateStarted: new Date().toISOString(),
      dateFinished: null,
      sections: course.sections
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
    const correctQuestionsNumber = Object.values(correctQuestions).filter(value => value).length;
    const threshold = section.correctAnswersThreshold || Math.floor(section.questions.length * 0.6);
    if(Object.values(correctQuestions).filter(x => !x).length > 0) {
      const response: QuizWrongAnswerResponse = {
        correctQuestionAnswers: correctQuestionsNumber >= threshold ? correctQuestions : null,
        remainingAttempts: 1,
        message: "Some or all of your answers are incorrect. Please try again."
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

interface ListenerWindow {
  window: any;
  courseId: number;
}
