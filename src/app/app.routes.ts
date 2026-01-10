import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component/login.component';
import { authGuard } from './services/auth.guard';
import { usersResolver } from './resolvers/users.resolver';
import { UsersViewComponent } from './components/users-view.component/users-view.component';

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
];
