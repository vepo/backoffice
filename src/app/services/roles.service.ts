import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Role {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly http = inject(HttpClient);

  private readonly API_URL = '/passport/api';

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.API_URL}/roles`);
  }

  getProfileById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.API_URL}/roles/${id}`);
  }
}