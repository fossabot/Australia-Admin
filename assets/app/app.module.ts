import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { Ng2PaginationModule } from 'ng2-pagination'; 
//import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TitleCasePipe } from './pipes/titleCase.pipe';
import { StringFilterPipe } from './pipes/string-filter.pipe';
import { Daterangepicker } from 'ng2-daterangepicker';
import { routing } from "./app.routing";

import {ColorPickerModule} from 'ng-color-picker';

//CHART JS
import {ChartsModule} from 'ng2-charts';

import { ProductThemeChangecomponent } from "./components/Products/productChildComponents/Product_ThemeChange.component";


import { PaginationModule } from 'ng2-bootstrap'; 
import { TabsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from 'ng2-table/ng2-table';

import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/loginComponent/login.component";
import { DashboardComponent } from "./components/dashboard.component";
import {LogoutComponent} from './components/loginComponent/logout.component';
import { OAOadminService} from "./services/OAOadmin.service";
import { PushToServer} from "./services/pushToServer.service";

import {ApplicationComponent} from "./components/applicationDetailsComponents/application/application.component";
import {ApplicationDetailsComponent} from "./components/applicationDetailsComponents/application/applicationDetails.component";

import {CompletedApplicationsComponent} from "./components/applicationDetailsComponents/completedApplication/completedApplications.component";
import {CompletedApplicationDetailsComponent} from "./components/applicationDetailsComponents/completedApplication/completedApplicationDetails.component";

import {IncompleteApplicationsComponent} from "./components/applicationDetailsComponents/incompletedApplication/incompleteApplications.component";
import {IncompleteApplicationDetailsComponent} from "./components/applicationDetailsComponents/incompletedApplication/incompleteApplicationDetails.component";

import { ActiveApplictionsChartComponent } from "./components/dashboardChildComponents/activeApplictionsChart.component";
import { CompletedApplicationsChartComponent } from "./components/dashboardChildComponents/completedApplicationsChart.component";
import { IncompletedApplicationsChartComponent } from "./components/dashboardChildComponents/incompletedApplicationsChart.component";
import { TotalApplicationsChartComponent } from "./components/dashboardChildComponents/totalApplicationsChart.component";
import {AssignedToValidator} from "./Validators/AssignedToValidator"
import { ProductsComponent } from "./components/Products/products.component";
import { productsDisplayComponent } from "./components/Products/productChildComponents/products_type.component";
import { SubProductsDisplayComponent } from "./components/Products/productChildComponents/Products.component";
import { TemplatesDisplayComponent } from "./components/Products/productChildComponents/Template.display.component";
import { LaddaModule } from 'angular2-ladda';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { UserComponent } from './components/users/user.component';
import { CreateUserComponent } from './components/users/userChildComponents/createuser.component';
import { ResetpasswordComponent } from './components/users/userChildComponents/resetpassword.component';
import {CrossSellProductComponent} from "./components/dashboardChildComponents/crossSellProduct.component";
import { office365 } from "./components/office365.component";
import { AuthGuard } from "./AuthGuard";
import { LoginTypeComponent } from "./components/logintype.component";
import { FileSelectDirective, FileDropDirective,FileUploader } from 'ng2-file-upload';//file upload
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DocumentsUpload } from "./components/docsUpload/docsUpload.component";
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { Http} from '@angular/http';
import { JsonEditor } from "./components/Products/productChildComponents/JSONeditor";
import { Features } from "./components/Products/productChildComponents/productFeatures.component";
import {SwitchThemeComponent} from "./components/Products/productChildComponents/switchtheme.component";
import {Integrations} from "./components/Products/productChildComponents/integration.component";
import { ClipboardModule } from 'ngx-clipboard';
import { AddNewField } from "./components/Products/productChildComponents/addnewField.component";
export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http);
}
const DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  maxFilesize: 50,
  acceptedFiles: '.zip,.jpg,.png,.jpeg'
};

@NgModule({
    declarations: [
            AppComponent,
            DashboardComponent,
            JsonEditor,
            Features,
            LoginComponent,
            LogoutComponent,

            ApplicationComponent,
            ApplicationDetailsComponent,
            CompletedApplicationsComponent,
            CompletedApplicationDetailsComponent,
            IncompleteApplicationsComponent,
            IncompleteApplicationDetailsComponent,
            ActiveApplictionsChartComponent,
            CompletedApplicationsChartComponent,
            IncompletedApplicationsChartComponent,
            TotalApplicationsChartComponent,
            CrossSellProductComponent,
            TitleCasePipe,

            StringFilterPipe,
            ProductsComponent,
           // CrossSellingProductsDisplayComponent,
            SubProductsDisplayComponent,
            productsDisplayComponent,
            TemplatesDisplayComponent,
            AssignedToValidator,
                UserComponent,
                CreateUserComponent,
				office365,
                LoginTypeComponent,
                ResetpasswordComponent,
		 DocumentsUpload,
         SwitchThemeComponent,
         Integrations,
	 ProductThemeChangecomponent,
     AddNewField


            ],
    providers: [
            OAOadminService,AuthGuard,PushToServer 
            ],

    imports: [
            AngularDualListBoxModule,
            BrowserModule,
            FormsModule,
            ReactiveFormsModule,
            HttpModule,
            routing,
            Ng2PaginationModule,
            Ng2TableModule,
            PaginationModule.forRoot(),
            TabsModule,
            Daterangepicker,
            ClipboardModule,
            LaddaModule.forRoot({
            style: "contract",
            spinnerSize: 40,
            spinnerColor: "grey",
            spinnerLines: 12,
            
        }),ChartsModule,
         TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
        DropzoneModule.forRoot(DROPZONE_CONFIG),
ColorPickerModule
            ],
   

    bootstrap: [AppComponent]
})
export class AppModule {

}
