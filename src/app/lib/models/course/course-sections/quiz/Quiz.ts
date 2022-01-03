import { CourseSection } from "../CourseSection";
import { QuizQuestion } from "./QuizQuestion";

export interface Quiz extends CourseSection {
  type: 'quiz';
  questions: QuizQuestion[];
}