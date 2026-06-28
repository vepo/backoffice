import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DomainsViewComponent } from './domains-view.component';
import { DomainService } from '../../services/domain.service';
import { createMatDialogSpy } from '../../testing/material-stubs';
import { MatDialog } from '@angular/material/dialog';

describe('DomainsViewComponent', () => {
  let component: DomainsViewComponent;
  let domainService: jasmine.SpyObj<DomainService>;

  beforeEach(async () => {
    domainService = jasmine.createSpyObj('DomainService', ['search', 'disable', 'enable', 'regenerateToken']);
    domainService.search.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [DomainsViewComponent],
      providers: [
        provideRouter([]),
        { provide: DomainService, useValue: domainService },
        { provide: MatDialog, useValue: createMatDialogSpy() },
        { provide: ActivatedRoute, useValue: { data: of({ domains: [{ id: 1, hostname: 'example.com', token: 'tok' }] }) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(DomainsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadDomainsFromResolver', () => {
    expect(component.domains.length).toBe(1);
  });

  it('shouldUpdateSearch', () => {
    component.updateSearch();
    expect(domainService.search).toHaveBeenCalled();
  });
});
