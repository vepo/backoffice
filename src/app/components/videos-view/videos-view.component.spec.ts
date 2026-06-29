import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { EngageService } from '../../services/engage.service';
import { VideosViewComponent } from './videos-view.component';

describe('VideosViewComponent', () => {
  let component: VideosViewComponent;
  let engageService: jasmine.SpyObj<EngageService>;

  beforeEach(async () => {
    engageService = jasmine.createSpyObj('EngageService', ['findVideosPage', 'findCommentWordCloud']);
    engageService.findVideosPage.and.returnValue(of({
      items: [{ id: 1, youtubeId: 'vid1', title: 'My Video', commentCount: 3 }],
      total: 1,
      page: 0,
      pageSize: 20
    }));
    engageService.findCommentWordCloud.and.returnValue(of([{ word: 'hello', count: 2 }]));

    await TestBed.configureTestingModule({
      imports: [VideosViewComponent],
      providers: [
        provideRouter([]),
        { provide: EngageService, useValue: engageService },
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap({ page: '0' })) }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(VideosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadVideosFromEngageService', () => {
    expect(engageService.findVideosPage).toHaveBeenCalledWith(0, 20, '');
    expect(engageService.findCommentWordCloud).toHaveBeenCalled();
    expect(component.videos.length).toBe(1);
    expect(component.videos[0].commentCount).toBe(3);
    expect(component.wordCloud.length).toBe(1);
  });

  it('shouldReloadWhenFilterChangesOnFirstPage', () => {
    component.titleFilter = 'My';
    component.applyFilters();
    expect(engageService.findVideosPage).toHaveBeenCalledWith(0, 20, 'My');
  });
});
