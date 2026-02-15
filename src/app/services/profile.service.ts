import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from './roles.service';

export interface Profile {
  id: number;
  name: string;
  roles: Role[];
}

export interface CreateOrUpdateProfile {
  name: string;
  roleIds: number[];
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

  search(filter: { name: string; roleId: number | null; }): Observable<Profile[]> {
    throw new Error('Method not implemented.');
  }
  
  delete(id: number): Observable<any> {
    throw new Error('Method not implemented.');
  }
}