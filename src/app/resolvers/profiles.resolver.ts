import { ResolveFn } from "@angular/router";
import { Role, RoleService } from "../services/roles.service";
import { inject } from "@angular/core";
import { Profile, ProfileService } from "../services/profile.service";

export const profilesResolver: ResolveFn<Profile[]> = (route, state) => {
    return inject(ProfileService).getAllProfiles();
};