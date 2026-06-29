import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component/login.component';
import { PasswordRecoveryComponent } from './components/password-recovery.component/password-recovery.component';
import { PasswordResetComponent } from './components/password-reset.component/password-reset.component';
import { UsersEditComponent } from './components/users-edit.component/users-edit.component';
import { UsersViewComponent } from './components/users-view.component/users-view.component';
import { userResolver, usersResolver } from './resolvers/users.resolver';
import { authGuard } from './services/auth.guard';
import { roleGuard } from './services/role.guard';
import { rolesResolver } from './resolvers/roles.resolver';
import { profileResolver, profilesResolver } from './resolvers/profiles.resolver';
import { ProfileViewComponent } from './components/profile-view.component/profile-view.component';
import { ProfileEditComponent } from './components/profile-edit.component/profile-edit.component';
import { RolesViewComponent } from './components/roles-view/roles-view.component';
import { RolesEditComponent } from './components/roles-edit/roles-edit.component';
import { DomainsViewComponent } from './components/domains-view/domains-view.component';
import { domainResolver, domainsResolver } from './resolvers/domains.resolver';
import { DomainsEditComponent } from './components/domains-edit/domains-edit.component';
import { StatusViewComponent } from './components/status-view/status-view.component';
import { AccountComponent } from './components/account.component/account.component';
import { EngageStatisticsViewComponent } from './components/engage-statistics-view/engage-statistics-view.component';
import { engageStatisticsResolver } from './resolvers/engage-statistics.resolver';
import { ChannelsViewComponent } from './components/channels-view/channels-view.component';
import { ChannelsEditComponent } from './components/channels-edit/channels-edit.component';
import { ChannelReportsViewComponent } from './components/channel-reports-view/channel-reports-view.component';
import { VideosViewComponent } from './components/videos-view/videos-view.component';
import { CommentsViewComponent } from './components/comments-view/comments-view.component';
import {
    engageChannelCommentWordCloudResolver,
    engageChannelCommentsResolver,
    engageChannelReportsResolver,
    engageChannelResolver,
    engageChannelsResolver,
    engageVideoCommentWordCloudResolver,
    engageVideoCommentsResolver
} from './resolvers/engage-channels.resolver';
import { NotificationsDetailComponent } from './components/notifications-detail/notifications-detail.component';
import { NotificationsViewComponent } from './components/notifications-view/notifications-view.component';
import { notificationResolver, notificationsResolver } from './resolvers/notifications.resolver';

export const routes: Routes = [
    { path: '', component: StatusViewComponent, canActivate: [authGuard] },
    {
        path: 'notifications',
        component: NotificationsViewComponent,
        resolve: {
            notifications: notificationsResolver
        },
        canActivate: [authGuard]
    },
    {
        path: 'notifications/:notificationId',
        component: NotificationsDetailComponent,
        resolve: {
            notification: notificationResolver
        },
        canActivate: [authGuard]
    },
    { path: 'account', component: AccountComponent, canActivate: [authGuard] },
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
        canActivate: [authGuard, roleGuard],
        data: { roles: ['passport.admin'] },
    },
    {
        path: 'users/new',
        component: UsersEditComponent,
        resolve: {
            availableRoles: rolesResolver,
            availableProfiles: profilesResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['passport.admin'] }
    },
    {
        path: 'users/:userId',
        component: UsersEditComponent,
        resolve: {
            user: userResolver,
            availableRoles: rolesResolver,
            availableProfiles: profilesResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['passport.admin'] }
    },
    {
        path: 'profiles',
        component: ProfileViewComponent,
        resolve: {
            availableRoles: rolesResolver,
            profiles: profilesResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['passport.admin'] },
    },
    {
        path: 'profiles/new',
        component: ProfileEditComponent,
        resolve: {
            availableRoles: rolesResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['passport.admin'] },
    },
    {
        path: 'profiles/:profileId',
        component: ProfileEditComponent,
        resolve: {
            availableRoles: rolesResolver,
            profile: profileResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['passport.admin'] },
    },
    {
        path: 'roles',
        component: RolesViewComponent,
        resolve: {
            roles: rolesResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['passport.admin'] },
    },
    {
        path: 'roles/new',
        component: RolesEditComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['passport.admin'] },
    },
    {
        path: 'domains',
        component: DomainsViewComponent,
        resolve: {
            domains: domainsResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['domains.admin'] },
    },
    {
        path: 'domains/new',
        component: DomainsEditComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['domains.admin'] },
    },
    {
        path: 'domains/:domainId',
        component: DomainsEditComponent,
        resolve: {
            domain: domainResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['domains.admin'] },
    },
    {
        path: 'engage/channels',
        component: ChannelsViewComponent,
        resolve: {
            channels: engageChannelsResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['engage.admin'] },
    },
    {
        path: 'engage/channels/new',
        component: ChannelsEditComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['engage.admin'] },
    },
    {
        path: 'engage/channels/:channelId/comments',
        component: CommentsViewComponent,
        resolve: {
            comments: engageChannelCommentsResolver,
            wordCloud: engageChannelCommentWordCloudResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['engage.admin'] },
    },
    {
        path: 'engage/channels/:channelId/reports',
        component: ChannelReportsViewComponent,
        resolve: {
            channel: engageChannelResolver,
            reports: engageChannelReportsResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['engage.admin'] },
    },
    {
        path: 'engage/channels/:channelId',
        component: ChannelsEditComponent,
        resolve: {
            channel: engageChannelResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['engage.admin'] },
    },
    {
        path: 'engage/videos',
        component: VideosViewComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['engage.admin'] },
    },
    {
        path: 'engage/videos/:videoId/comments',
        component: CommentsViewComponent,
        resolve: {
            comments: engageVideoCommentsResolver,
            wordCloud: engageVideoCommentWordCloudResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['engage.admin'] },
    },
    {
        path: 'engage/statistics',
        component: EngageStatisticsViewComponent,
        resolve: {
            statistics: engageStatisticsResolver
        },
        canActivate: [authGuard, roleGuard],
        data: { roles: ['engage.admin'] },
    }
];
