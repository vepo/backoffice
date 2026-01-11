import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component/login.component';
import { authGuard } from './services/auth.guard';
import { userResolver, usersResolver } from './resolvers/users.resolver';
import { UsersViewComponent } from './components/users-view.component/users-view.component';
import { UsersEditComponent } from './components/users-edit.component/users-edit.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'users',
        component: UsersViewComponent,
        resolve: {
            users: usersResolver
        },
        canActivate: [authGuard],
    },
    {
        path: 'users/new',
        component: UsersEditComponent,
        canActivate: [authGuard],
    },
    {
        path: 'users/:userId',
        component: UsersEditComponent,
        resolve: {
            user: userResolver
        },
        canActivate: [authGuard],
    },
];
