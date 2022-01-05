import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeEditorComponent } from './trainee-editor.component';

describe('TraineeEditorComponent', () => {
  let component: TraineeEditorComponent;
  let fixture: ComponentFixture<TraineeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraineeEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraineeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
