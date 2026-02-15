import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Role {
  id: number;
  name: string;
}

export interface RoleSearchFilter {
  name: string | null;
}

export const emptyFilter = (): RoleSearchFilter => ({
  name: null
});

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly http = inject(HttpClient);

  private readonly API_URL = '/passport/api';

  findAll(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.API_URL}/roles`);
  }

  search(filter: RoleSearchFilter): Observable<Role[]> {
    let params = new HttpParams();

    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = filter[key as keyof RoleSearchFilter];

        // Skip null, undefined, empty string, or empty array
        if (value !== null && value !== undefined && value !== '' &&
          !(Array.isArray(value) && value.length === 0)) {

          // Handle array values by joining them or adding multiple params
          if (Array.isArray(value)) {
            console.debug("Appending query array", value);
            value.forEach(item => params = params.append(key, item.toString()));
          } else {
            params = params.append(key, value.toString());
          }
        }
      });
    }
    return this.http.get<Role[]>(`${this.API_URL}/roles/search`, { params: params });
  }


  findById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.API_URL}/roles/${id}`);
  }
  create(role: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(`${this.API_URL}/roles`, role);
  }

  update(id: number, role: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`${this.API_URL}/roles/${id}`, role);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/roles/${id}`);
  }
}