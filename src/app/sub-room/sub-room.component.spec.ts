import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubRoomComponent } from './sub-room.component';

describe('SubRoomComponent', () => {
  let component: SubRoomComponent;
  let fixture: ComponentFixture<SubRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
