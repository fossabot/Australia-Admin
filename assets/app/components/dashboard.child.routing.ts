import { Routes } from "@angular/router";

import { ActiveApplictionsChartComponent } from "./dashboardChildComponents/activeApplictionsChart.component";
import { CompletedApplicationsChartComponent } from "./dashboardChildComponents/completedApplicationsChart.component";
import { IncompletedApplicationsChartComponent } from "./dashboardChildComponents/incompletedApplicationsChart.component";
import { TotalApplicationsChartComponent } from "./dashboardChildComponents/totalApplicationsChart.component";
import {CrossSellProductComponent} from  "./dashboardChildComponents/crossSellProduct.component";

// import {Application} from "./app.application";

export const CHILD_ROUTES: Routes = [
    { path: '', redirectTo: 'totalChart', pathMatch: 'full' },
    { path: 'totalChart', component: TotalApplicationsChartComponent },
    { path: 'completeChart', component: CompletedApplicationsChartComponent },
    { path: 'incompleteChart', component: IncompletedApplicationsChartComponent },
    { path: 'active', component: ActiveApplictionsChartComponent },
    { path: 'crossSell',component:CrossSellProductComponent}
];