import { Course } from "./course/Course";
import { QuizAttempt } from "./course/course-sections/quiz/QuizAttempt";
import { CourseRegistration } from "./course/CourseRegistration";

export interface CourseProgress {
  registration: CourseRegistration;
  course: Course;
  quizAttempts: QuizAttempt[];
}