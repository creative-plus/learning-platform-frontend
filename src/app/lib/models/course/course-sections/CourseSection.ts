import { CourseSectionType } from "./CourseSectionType";

export interface CourseSection {
  id: number;
  title: string;
  order: number;
  type: CourseSectionType;
}