import { ResolveFn } from "@angular/router";
import { Role, RoleService } from "../services/roles.service";
import { inject } from "@angular/core";

export const rolesResolver: ResolveFn<Role[]> = (route, state) => {
    return inject(RoleService).getAllRoles();
};