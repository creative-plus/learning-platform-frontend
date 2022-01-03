import { QuizQuestionAnswer } from "./QuizQuestionAnswer";

export interface QuizQuestion {
  id: number;
  text: string;
  multipleAnswer: boolean;
  answers: QuizQuestionAnswer[];
}