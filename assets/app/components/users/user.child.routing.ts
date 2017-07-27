import { Routes } from "@angular/router";

import { CreateUserComponent } from "./userChildComponents/createuser.component";
import { ResetpasswordComponent } from "./userChildComponents/resetpassword.component";
// import { xxxxx } from "./userChildComponents/CrossSellingProducts.component";

// import {Application} from "./app.application";

export const USER_CHILD_ROUTES: Routes = [
    { path: '', redirectTo: 'createuser', pathMatch: 'full' },
    { path: 'createuser', component: CreateUserComponent },
    { path: 'resetpassword', component: ResetpasswordComponent },
    { path: 'xxxxx', component: CreateUserComponent }
];