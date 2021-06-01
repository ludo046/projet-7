import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeCommentsComponent } from './like-comments.component';

describe('LikeCommentsComponent', () => {
  let component: LikeCommentsComponent;
  let fixture: ComponentFixture<LikeCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikeCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
