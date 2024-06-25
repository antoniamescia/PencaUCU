import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterResultsModalComponent } from './enter-results-modal.component';

describe('EnterResultsModalComponent', () => {
  let component: EnterResultsModalComponent;
  let fixture: ComponentFixture<EnterResultsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnterResultsModalComponent]
    });
    fixture = TestBed.createComponent(EnterResultsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
