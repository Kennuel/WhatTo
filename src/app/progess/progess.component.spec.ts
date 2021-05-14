import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgessComponent } from './progess.component';

describe('ProgessComponent', () => {
  let component: ProgessComponent;
  let fixture: ComponentFixture<ProgessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
