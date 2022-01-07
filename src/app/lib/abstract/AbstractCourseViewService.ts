import { Observable } from "rxjs";
import { Course } from "../models/course/Course";
import { CourseSection } from "../models/course/course-sections/CourseSection";
import { QuizAnswers } from "../models/course/course-sections/quiz/quiz-answers/QuizAnswers";
import { CourseRegistration } from "../models/course/CourseRegistration";

export abstract class AbstractCourseViewService {
  abstract getCourse(courseId: number): Observable<Course>;

  abstract getCourseRegistration(courseId: number): Observable<CourseRegistration>;

  abstract passSection(courseId: number, sectionId: number, quizAnswers?: QuizAnswers): Observable<CourseRegistration | QuizWrongAnswerResponse>;

  abstract getSection(courseId: number, sectionId: number): Observable<CourseSection>;

}

export interface QuizWrongAnswerResponse {
  correctQuestionAnswers: ICorrectQuestionAnswers;
}

export interface ICorrectQuestionAnswers {
  [questionId: number]: boolean;
}