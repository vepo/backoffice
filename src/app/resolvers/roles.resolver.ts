import { inject } from "@angular/core";
import { RedirectCommand, ResolveFn, Router } from "@angular/router";
import { Role, RoleService } from "../services/roles.service";

export const rolesResolver: ResolveFn<Role[]> = (route, state) => {
    return inject(RoleService).findAll();
};

export const roleResolver: ResolveFn<Role | null> = (route) => {
    const roleId = route.paramMap.get('roleId');
    console.log('roleResolver: Resolving role with id:', roleId);
    if (!roleId) {
        return new RedirectCommand(inject(Router).parseUrl('/'));
    }
    return inject(RoleService).findById(parseInt(roleId));
};