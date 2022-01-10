import { CourseSection } from "../CourseSection";
import { QuizQuestion } from "./QuizQuestion";

export interface Quiz extends CourseSection {
  type: 'quiz';
  correctAnswersThreshold?: number;
  questions: QuizQuestion[];
}