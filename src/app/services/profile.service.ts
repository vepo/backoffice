import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from './roles.service';

export interface Profile {
  id: number;
  name: string;
  roles: Role[];
  disabled: boolean;
}

export interface ProfileSearchFilter {
  name: string;
  roles: number[];
  disabled: boolean | null;
}

export interface CreateOrUpdateProfile {
  name: string;
  roleIds: number[];
}

export function emptyFilter(): ProfileSearchFilter {
  return {
    name: "",
    roles: [],
    disabled: false
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/passport/api';

  getAllProfiles(): Observable<Profile[]> {
    // Assuming we have an endpoint to list all profiles
    // You might need to implement this endpoint in the backend
    return this.http.get<Profile[]>(`${this.API_URL}/profiles`);
  }

  getProfileById(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.API_URL}/profiles/${id}`);
  }

  create(req: CreateOrUpdateProfile) {
    return this.http.post<Profile>(`${this.API_URL}/profiles/`, req);
  }

  update(profileId: number, req: CreateOrUpdateProfile) {
    return this.http.put<Profile>(`${this.API_URL}/profiles/${profileId}`, req);
  }

  search(filter: ProfileSearchFilter): Observable<Profile[]> {
    let params = new HttpParams();

    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = filter[key as keyof ProfileSearchFilter];

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

    return this.http.get<Profile[]>(`${this.API_URL}/profiles/search`, { params: params });
  }

  disable(profileId: number): Observable<Profile> {
    return this.http.post<Profile>(`${this.API_URL}/profiles/${profileId}/disable`, {});
  }

  enable(profileId: number): Observable<Profile> {
    return this.http.post<Profile>(`${this.API_URL}/profiles/${profileId}/enable`, {});
  }
}