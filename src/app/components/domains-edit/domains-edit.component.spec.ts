import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DomainsEditComponent } from './domains-edit.component';
import { DomainService } from '../../services/domain.service';

describe('DomainsEditComponent', () => {
  let domainService: jasmine.SpyObj<DomainService>;

  beforeEach(async () => {
    domainService = jasmine.createSpyObj('DomainService', ['create', 'update']);
    domainService.create.and.returnValue(of({ id: 1, hostname: 'new.com', token: 't' }));

    await TestBed.configureTestingModule({
      imports: [DomainsEditComponent],
      providers: [
        provideRouter([]),
        { provide: DomainService, useValue: domainService },
        { provide: ActivatedRoute, useValue: { data: of({ domain: null }) } }
      ]
    }).compileComponents();
  });

  it('shouldCreateDomainOnSubmit', () => {
    const fixture = TestBed.createComponent(DomainsEditComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));
    component.domainForm.setValue({ hostname: 'newsite.com', ignoredPathPatterns: '/admin\n/api' });
    component.save();
    expect(domainService.create).toHaveBeenCalled();
  });
});
