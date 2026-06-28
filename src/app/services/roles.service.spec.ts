import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RoleService } from './roles.service';

describe('RoleService', () => {
  let service: RoleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(RoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  const role = { id: 1, name: 'passport.admin' };

  it('shouldFindAllRoles', () => {
    service.findAll().subscribe();
    httpMock.expectOne('/passport/api/roles').flush([role]);
  });

  it('shouldSearchRoles', () => {
    service.search({ name: 'passport' }).subscribe();
    httpMock.expectOne(r => r.url === '/passport/api/roles/search').flush([role]);
  });

  it('shouldFindRoleById', () => {
    service.findById(1).subscribe();
    httpMock.expectOne('/passport/api/roles/1').flush(role);
  });

  it('shouldCreateRole', () => {
    service.create({ name: 'new.role' }).subscribe();
    const req = httpMock.expectOne('/passport/api/roles');
    expect(req.request.method).toBe('POST');
    req.flush(role);
  });

  it('shouldDeleteRole', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne('/passport/api/roles/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
