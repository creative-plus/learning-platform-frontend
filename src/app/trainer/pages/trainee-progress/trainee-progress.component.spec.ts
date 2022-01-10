import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeProgressComponent } from './trainee-progress.component';

describe('TraineeProgressComponent', () => {
  let component: TraineeProgressComponent;
  let fixture: ComponentFixture<TraineeProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraineeProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraineeProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
