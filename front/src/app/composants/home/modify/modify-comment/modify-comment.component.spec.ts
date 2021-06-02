import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCommentComponent } from './modify-comment.component';

describe('ModifyCommentComponent', () => {
  let component: ModifyCommentComponent;
  let fixture: ComponentFixture<ModifyCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
