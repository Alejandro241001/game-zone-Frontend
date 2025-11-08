import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioEditComponent } from './studio-edit.component';

describe('StudioEditComponent', () => {
  let component: StudioEditComponent;
  let fixture: ComponentFixture<StudioEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudioEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
