import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Profile } from './profile.service';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  profiles: Profile[];  // Changed from roles to profiles
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Helper property for frontend compatibility
  roles?: string[]; // Derived from profiles for frontend display
}

export interface UserSearchFilter {
  name: string;
  email: string;
  username: string;
  profiles: number[];  // Changed from string[] to number[] (profile IDs)
  roles: number[];     // Added for backend compatibility (role IDs)
  disabled: boolean;
}

export interface UpdateOrCreateUserRequest {
  name: string;
  username: string;
  email: string;
  profileIds: number[];  // Changed from roles to profileIds (number array)
}

export function emptyFilter(): UserSearchFilter {
  return {
    name: '',
    email: '',
    username: '',
    profiles: [],
    roles: [],
    disabled: false
  };
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);

  private readonly API_URL = '/passport/api';

  findById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${userId}`).pipe(
      // Map backend response to include roles for frontend compatibility
      map(user => this.mapUserToFrontend(user))
    );
  }

  create(user: UpdateOrCreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/users`, user).pipe(
      map(user => this.mapUserToFrontend(user))
    );
  }

  update(userId: number, user: UpdateOrCreateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/${userId}`, user).pipe(
      map(user => this.mapUserToFrontend(user))
    );
  }

  disable(userId: number): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/users/${userId}/disable`, {}).pipe(
      map(user => this.mapUserToFrontend(user))
    );
  }

  enable(userId: number): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/users/${userId}/enable`, {}).pipe(
      map(user => this.mapUserToFrontend(user))
    );
  }

  search(filter?: UserSearchFilter): Observable<User[]> {
    let params = new HttpParams();

    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = filter[key as keyof UserSearchFilter];

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

    return this.http.get<User[]>(`${this.API_URL}/users/search`, { params: params }).pipe(
      map(users => users.map(user => this.mapUserToFrontend(user)))
    );
  }

  // Helper method to map backend user to frontend format
  private mapUserToFrontend(user: User): User {
    // Extract role names from profiles for frontend display
    const roles = user.profiles.flatMap(profile => {
      // Assuming profile names represent roles or we need to get roles from profiles
      // For now, using profile names as role identifiers
      return [profile.name.toLowerCase()];
    });

    return {
      ...user,
      roles: roles
    };
  }

  // Helper method to map frontend user to backend format
  mapUserToBackend(user: UpdateOrCreateUserRequest): any {
    return {
      name: user.name,
      username: user.username,
      email: user.email,
      profileIds: user.profileIds
    };
  }
}