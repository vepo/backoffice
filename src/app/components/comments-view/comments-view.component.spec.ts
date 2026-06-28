import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { CommentsViewComponent } from './comments-view.component';

describe('CommentsViewComponent', () => {
  let component: CommentsViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsViewComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ comments: [{ id: 1, youtubeCommentId: 'c1', videoId: 1, text: 'Hello', authorName: 'User' }] }),
            paramMap: of(convertToParamMap({ videoId: '1' }))
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(CommentsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadCommentsForVideoContext', () => {
    expect(component.context).toBe('video');
    expect(component.comments.length).toBe(1);
  });

  it('shouldFilterCommentsByText', () => {
    component.textFilter = 'Hello';
    component.applyFilters();
    expect(component.filteredComments.length).toBe(1);
  });
});
