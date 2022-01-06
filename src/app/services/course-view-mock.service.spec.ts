import { TestBed } from '@angular/core/testing';

import { CourseViewMockService } from './course-view-mock.service';

describe('CourseViewMockService', () => {
  let service: CourseViewMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseViewMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
