import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component/login.component';
import { PasswordRecoveryComponent } from './components/password-recovery.component/password-recovery.component';
import { PasswordResetComponent } from './components/password-reset.component/password-reset.component';
import { UsersEditComponent } from './components/users-edit.component/users-edit.component';
import { UsersViewComponent } from './components/users-view.component/users-view.component';
import { userResolver, usersResolver } from './resolvers/users.resolver';
import { authGuard } from './services/auth.guard';
import { roleResolver, rolesResolver } from './resolvers/roles.resolver';
import { profileResolver, profilesResolver } from './resolvers/profiles.resolver';
import { ProfileViewComponent } from './components/profile-view.component/profile-view.component';
import { ProfileEditComponent } from './components/profile-edit.component/profile-edit.component';
import { RolesViewComponent } from './components/roles-view/roles-view.component';
import { RolesEditComponent } from './components/roles-edit/roles-edit.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'login/recovery', component: PasswordRecoveryComponent },
    { path: 'password/reset/:token', component: PasswordResetComponent },
    {
        path: 'users',
        component: UsersViewComponent,
        resolve: {
            users: usersResolver,
            availableRoles: rolesResolver,
            availableProfiles: profilesResolver
        },
        canActivate: [authGuard],
    },
    {
        path: 'users/new',
        component: UsersEditComponent,
        resolve: {
            availableRoles: rolesResolver,
            availableProfiles: profilesResolver
        },
        canActivate: [authGuard]
    },
    {
        path: 'users/:userId',
        component: UsersEditComponent,
        resolve: {
            user: userResolver,
            availableRoles: rolesResolver,
            availableProfiles: profilesResolver
        },
        canActivate: [authGuard]
    },
    {
        path: 'profiles',
        component: ProfileViewComponent,
        resolve: {
            availableRoles: rolesResolver,
            profiles: profilesResolver
        },
        canActivate: [authGuard],
    },
    {
        path: 'profiles/new',
        component: ProfileEditComponent,
        resolve: {
            availableRoles: rolesResolver
        },
        canActivate: [authGuard],
    },
    {
        path: 'profiles/:profileId',
        component: ProfileEditComponent,
        resolve: {
            availableRoles: rolesResolver,
            profile: profileResolver
        },
        canActivate: [authGuard],
    },
    {
        path: 'roles',
        component: RolesViewComponent,
        resolve: {
            roles: rolesResolver
        },
        canActivate: [authGuard],
    },
    {
        path: 'roles/new',
        component: RolesEditComponent,
        canActivate: [authGuard],
    },
    {
        path: 'roles/:roleId',
        component: ProfileEditComponent,
        resolve: {
            role: roleResolver
        },
        canActivate: [authGuard],
    }
];
