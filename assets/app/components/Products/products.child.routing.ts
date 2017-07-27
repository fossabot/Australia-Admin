import { Routes } from "@angular/router";

import { productsDisplayComponent } from "./productChildComponents/products_type.component";
import { SubProductsDisplayComponent } from "./productChildComponents/Products.component";
import { TemplatesDisplayComponent } from "./productChildComponents/Template.display.component";
import { JsonEditor } from "./productChildComponents/JSONeditor";
import {SwitchThemeComponent} from "./productChildComponents/switchtheme.component";
import {Integrations} from "./productChildComponents/integration.component"
import {Features} from "./productChildComponents/productFeatures.component";
import {AddNewField} from "./productChildComponents/addnewField.component";

//import {DOC_UPLOAD_CHILD_ROUTES} from "../../components/docsUpload/docsUpload.child.routing";
//import { CrossSellingProductsDisplayComponent } from "./productChildComponents/CrossSellingProducts.component";

// import {Application} from "./app.application";

import { ProductThemeChangecomponent } from "./productChildComponents/Product_ThemeChange.component";

export const PRODUCT_CHILD_ROUTES: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: productsDisplayComponent },
    { path: 'SubProducts', component: SubProductsDisplayComponent },
    { path: 'ProductFeatures', component: Features },
    { path: 'jsonEditor', component: JsonEditor },
     { path: 'templates', component: TemplatesDisplayComponent},
     {path:'SwitchTheme',component:SwitchThemeComponent},
     {path:'Integration', component:Integrations},
     { path: 'templatess', component: ProductThemeChangecomponent},
     { path: 'AddNewField', component: AddNewField}
  //  { path: 'CrossSellingProducts', component: CrossSellingProductsDisplayComponent }
];