import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideogameCreateComponent } from './videogame-create.component';

describe('VideogameCreateComponent', () => {
  let component: VideogameCreateComponent;
  let fixture: ComponentFixture<VideogameCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideogameCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideogameCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
