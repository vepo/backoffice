import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Domain {
    id: number;
    hostname: string;
    token: string;
    disabled?: boolean;
    ignoredPathPatterns?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface DomainSearchFilter {
    hostname: string | null;
    disabled: boolean | null;
}

export const emptyFilter = (): DomainSearchFilter => ({
    hostname: null,
    disabled: false // Por padrão, mostra apenas ativos
});

@Injectable({
    providedIn: 'root'
})
export class DomainService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = '/visita/api/domains';

    findAll(): Observable<Domain[]> {
        return this.http.get<Domain[]>(this.API_URL);
    }

    search(filter: DomainSearchFilter): Observable<Domain[]> {
        let params = new HttpParams();

        if (filter) {
            Object.keys(filter).forEach(key => {
                const value = filter[key as keyof DomainSearchFilter];

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
        return this.http.get<Domain[]>(`${this.API_URL}/search`, { params: params });
    }

    findById(id: number): Observable<Domain> {
        return this.http.get<Domain>(`${this.API_URL}/${id}`);
    }

    create(domain: Partial<Domain>): Observable<Domain> {
        return this.http.post<Domain>(this.API_URL, domain);
    }

    update(id: number, domain: Partial<Domain>): Observable<Domain> {
        return this.http.put<Domain>(`${this.API_URL}/${id}`, domain);
    }

    disable(id: number): Observable<Domain> {
        return this.http.patch<Domain>(`${this.API_URL}/${id}/disable`, {});
    }

    enable(id: number): Observable<Domain> {
        return this.http.patch<Domain>(`${this.API_URL}/${id}/enable`, {});
    }

    regenerateToken(id: number): Observable<Domain> {
        return this.http.post<Domain>(`${this.API_URL}/${id}/regenerate-token`, {});
    }
}