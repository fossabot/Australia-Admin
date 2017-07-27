import { Routes } from "@angular/router";

import { DocumentsUpload } from "./docsUpload.component";
// import {Application} from "./app.application";

export const DOC_UPLOAD_CHILD_ROUTES: Routes = [
    { path: '', redirectTo: 'Zip', pathMatch: 'full' },
    { path: 'Zip', component: DocumentsUpload },
  
];