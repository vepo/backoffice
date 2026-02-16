import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Domain, DomainService } from '../services/domain.service';

export const domainsResolver: ResolveFn<Domain[]> = () => {
    return inject(DomainService).findAll();
};

export const domainResolver: ResolveFn<Domain> = (route) => {
    const domainId = route.paramMap.get('domainId');
    if (!domainId) {
        return new RedirectCommand(inject(Router).parseUrl('/'));
    }
    return inject(DomainService).findById(Number(domainId));
};