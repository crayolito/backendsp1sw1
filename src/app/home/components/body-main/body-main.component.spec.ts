import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyMainComponent } from './body-main.component';

describe('BodyMainComponent', () => {
  let component: BodyMainComponent;
  let fixture: ComponentFixture<BodyMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BodyMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
