import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMatchModalComponent } from './edit-match-modal.component';

describe('EditMatchModalComponent', () => {
  let component: EditMatchModalComponent;
  let fixture: ComponentFixture<EditMatchModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMatchModalComponent]
    });
    fixture = TestBed.createComponent(EditMatchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
