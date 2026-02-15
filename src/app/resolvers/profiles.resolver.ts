import { RedirectCommand, ResolveFn, Router } from "@angular/router";
import { Role, RoleService } from "../services/roles.service";
import { inject } from "@angular/core";
import { Profile, ProfileService } from "../services/profile.service";

export const profilesResolver: ResolveFn<Profile[]> = (route, state) => {
    return inject(ProfileService).getAllProfiles();
};

export const profileResolver: ResolveFn<Profile> = (route, state) => {
    const profileId = route.paramMap.get('profileId');
    console.log('profileResolver: Resolving profile with id:', profileId);
    if (!profileId) {
        return new RedirectCommand(inject(Router).parseUrl('/'));
    }
    return inject(ProfileService).getProfileById(Number(profileId));
};