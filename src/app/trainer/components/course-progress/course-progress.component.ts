import { Component, Input, OnInit } from '@angular/core';
import { CourseSection } from 'src/app/lib/models/course/course-sections/CourseSection';
import { Quiz } from 'src/app/lib/models/course/course-sections/quiz/Quiz';
import { QuizAttempt } from 'src/app/lib/models/course/course-sections/quiz/QuizAttempt';
import { CourseProgress } from 'src/app/lib/models/CourseProgress';
import { arrayToMap, copyObject, getLastElement, groupBy } from 'src/app/lib/util';

@Component({
  selector: 'app-course-progress',
  templateUrl: './course-progress.component.html',
  styleUrls: ['./course-progress.component.scss']
})
export class CourseProgressComponent implements OnInit {

  constructor() { }

  @Input() courseProgress: CourseProgress;
  

  ngOnInit(): void {
  }

  get quizAttemptsGrouped() {
    return groupBy(this.courseProgress.quizAttempts, (quiz) => quiz.quizId);
  }

  get quizCorrectAnswers() {
    return Object.values(this.quizAttemptsGrouped)
      .map(attempts => this.getHighestScore(attempts))
      .reduce((s, x) => s + x, 0);
  }

  private getHighestScore(attempts: QuizAttempt[]): number {
    return getLastElement([...attempts].map(a => a.correctAnswers).sort());
  }

  get quizTotalQuestions() {
    return Object.values(this.quizAttemptsGrouped)
      .map(attempts => attempts[0].totalQuestions)
      .reduce((s, x) => s + x, 0);
  }

  get passedSectionsLength() {
    return this.courseProgress.registration.sections.length;
  }

  get totalSections() {
    return this.courseProgress.course.sections.length;
  }

  get courseSectionsMap() {
    return arrayToMap(this.courseProgress.course.sections, "id");
  }

  get passedSections() {
    return this.courseProgress.registration.sections.map(section => {
      const enrichedSection = copyObject(section) as EnrichedCourseRegistrationSection;
      if(section.type == 'quiz') {
        const courseSection = this.courseSectionsMap[section.id] as Quiz;
        enrichedSection.quizAttempts = this.quizAttemptsGrouped[section.id];
        enrichedSection.threshold = courseSection.correctAnswersThreshold;
        enrichedSection.passedQuiz = this.getHighestScore(enrichedSection.quizAttempts) >= enrichedSection.threshold;
      }
      return enrichedSection;
    });
  }

}

interface EnrichedCourseRegistrationSection extends CourseSection {
  quizAttempts?: QuizAttempt[];
  threshold?: number;
  passedQuiz?: boolean;
}
