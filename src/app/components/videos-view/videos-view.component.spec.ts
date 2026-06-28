import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { VideosViewComponent } from './videos-view.component';

describe('VideosViewComponent', () => {
  let component: VideosViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideosViewComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { data: of({ videos: [{ id: 1, youtubeId: 'vid1', title: 'My Video' }] }) }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(VideosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadVideosFromResolver', () => {
    expect(component.videos.length).toBe(1);
  });

  it('shouldFilterVideosByTitle', () => {
    component.titleFilter = 'My';
    component.applyFilters();
    expect(component.filteredVideos.length).toBe(1);
  });
});
