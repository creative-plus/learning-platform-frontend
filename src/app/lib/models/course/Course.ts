import { CourseSection } from "./course-sections/CourseSection";
import { CourseRegistration } from "./CourseRegistration";

export interface Course {
  id?: number;
  name: string;
  description: string;
  sectionNumber?: number;
  sections?: CourseSection[];
  registration?: CourseRegistration;
}