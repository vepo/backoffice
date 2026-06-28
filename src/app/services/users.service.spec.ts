import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shouldSearchUsers', () => {
    service.search().subscribe(users => expect(users.length).toBe(1));
    const req = httpMock.expectOne(r => r.url === '/passport/api/users/search');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, username: 'u', name: 'U', email: 'u@x.com', profiles: [], disabled: false, createdAt: new Date(), updatedAt: new Date() }]);
  });

  it('shouldFindUserById', () => {
    service.findById(1).subscribe(user => expect(user.id).toBe(1));
    const req = httpMock.expectOne('/passport/api/users/1');
    req.flush({ id: 1, username: 'u', name: 'U', email: 'u@x.com', profiles: [], disabled: false, createdAt: new Date(), updatedAt: new Date() });
  });

  it('shouldCreateUser', () => {
    const payload = { name: 'N', username: 'n', email: 'n@x.com', profileIds: [1] };
    service.create(payload).subscribe();
    const req = httpMock.expectOne('/passport/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 2, ...payload, profiles: [], disabled: false, createdAt: new Date(), updatedAt: new Date() });
  });

  it('shouldUpdateUser', () => {
    const payload = { name: 'N', username: 'n', email: 'n@x.com', profileIds: [1] };
    service.update(1, payload).subscribe();
    const req = httpMock.expectOne('/passport/api/users/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 1, ...payload, profiles: [], disabled: false, createdAt: new Date(), updatedAt: new Date() });
  });

  it('shouldDisableUser', () => {
    service.disable(1).subscribe();
    const req = httpMock.expectOne('/passport/api/users/1/disable');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, username: 'u', name: 'U', email: 'u@x.com', profiles: [], disabled: true, createdAt: new Date(), updatedAt: new Date() });
  });

  it('shouldEnableUser', () => {
    service.enable(1).subscribe();
    const req = httpMock.expectOne('/passport/api/users/1/enable');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, username: 'u', name: 'U', email: 'u@x.com', profiles: [], disabled: false, createdAt: new Date(), updatedAt: new Date() });
  });
});
