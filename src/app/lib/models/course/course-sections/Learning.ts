import { CourseSection } from "./CourseSection";

export interface Learning extends CourseSection {
  type: 'learning';
  content: string;
}