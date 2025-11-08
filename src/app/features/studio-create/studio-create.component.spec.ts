import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioCreateComponent } from './studio-create.component';

describe('StudioCreateComponent', () => {
  let component: StudioCreateComponent;
  let fixture: ComponentFixture<StudioCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudioCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudioCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
