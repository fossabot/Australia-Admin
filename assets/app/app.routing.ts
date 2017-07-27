import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/loginComponent/login.component";
import { DashboardComponent } from "./components/dashboard.component";
import {LogoutComponent} from './components/loginComponent/logout.component'
import { ProductsComponent } from "./components/Products/products.component";
import {ApplicationComponent} from "./components/applicationDetailsComponents/application/application.component";
import {ApplicationDetailsComponent} from "./components/applicationDetailsComponents/application/applicationDetails.component"

import {CompletedApplicationsComponent} from "./components/applicationDetailsComponents/completedApplication/completedApplications.component"
import {CompletedApplicationDetailsComponent} from "./components/applicationDetailsComponents/completedApplication/completedApplicationDetails.component"

import {IncompleteApplicationsComponent} from "./components/applicationDetailsComponents/incompletedApplication/incompleteApplications.component"
import {IncompleteApplicationDetailsComponent} from "./components/applicationDetailsComponents/incompletedApplication/incompleteApplicationDetails.component"

import {CHILD_ROUTES} from "./components/dashboard.child.routing";
import {PRODUCT_CHILD_ROUTES} from "./components/Products/products.child.routing";
import { USER_CHILD_ROUTES } from "./components/users/user.child.routing";
import { UserComponent } from './components/users/user.component';
import { office365 } from "./components/office365.component";
import { AuthGuard } from "./AuthGuard";
import { LoginTypeComponent } from "./components/logintype.component";

const APP_ROUTES: Routes = [
	{ path: 'office365/:token', component: office365 },
   /* { path: '', redirectTo: '/logintype', pathMatch: 'full' },*/
    { path: 'logintype',component: LoginTypeComponent ,canActivate:[AuthGuard]  },

    { path: 'login', component: LoginComponent ,canActivate:[AuthGuard]},
    { path: 'login/service', component: LoginComponent ,canActivate:[AuthGuard]},
    { path: 'login/product', component: LoginComponent ,canActivate:[AuthGuard]},
    { path: 'login/admin', component: LoginComponent ,canActivate:[AuthGuard]},
	{ path: 'dashboard', component: DashboardComponent,children: CHILD_ROUTES },
    { path: 'application', component: ApplicationComponent,canActivate:[AuthGuard] },
    { path: 'application_details/:cust_id', component: ApplicationDetailsComponent,canActivate:[AuthGuard] },

    { path: 'application_complete', component: CompletedApplicationsComponent },
    { path: 'complete_application_details', component: CompletedApplicationDetailsComponent },
   
    { path: 'application_incompletet', component: IncompleteApplicationsComponent },
    { path: 'application_incomplete_details', component: IncompleteApplicationDetailsComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'Products', component: ProductsComponent,children: PRODUCT_CHILD_ROUTES },
    { path: 'users', component: UserComponent, children: USER_CHILD_ROUTES },
    
];

export const routing = RouterModule.forRoot(APP_ROUTES);