import { CourseSection } from "./course-sections/CourseSection";

export interface CourseRegistration {
  id: {
    courseId: number;
    sectionId: number;
  },
  dateStarted: string;
  dateFinished: string;
  sections: CourseSection[];
}