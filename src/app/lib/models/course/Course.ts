import { CourseRegistration } from "./CourseRegistration";

export interface Course {
  id: number;
  name: string;
  description: string;
  sectionNumber?: number;
  registration?: CourseRegistration;
}