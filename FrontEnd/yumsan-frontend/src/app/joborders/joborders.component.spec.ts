import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobordersComponent } from './joborders.component';

describe('JobordersComponent', () => {
  let component: JobordersComponent;
  let fixture: ComponentFixture<JobordersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobordersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
