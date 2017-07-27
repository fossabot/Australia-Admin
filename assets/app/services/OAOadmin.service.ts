import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Customers } from "../interfaces/Customer.interface";
import { loginModel } from "../interfaces/login.interface";
import { CustomeStyleInterface } from "../interfaces/customeStyle";
//import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigDetails } from "../interfaces/configinterface";

@Injectable()
export class OAOadminService {
    private customers: Customers[] = [];

    // private baseURL: String = "http://localhost:3001";


    //private baseURL:String = "https://compressedadmin.herokuapp.com";
    // http://192.168.1.117:3000
    baseURL: string = "http://localhost:3001";
    officeAccountLoggedIn: boolean;
    public isLogedIn: Boolean;
    configMsg: ConfigDetails
    constructor(private http: Http) {
        this.isLogedIn = false;
    }

    //CROSS PRODUCT SERVICES

    /* getAllCrossSellingProducts(){
        return this.http.get(`${this.baseURL}/api/GetAllCrossSellingProducts`)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }*/

    //  COLOR CHANGE CODE

    customeStyle(styleData: CustomeStyleInterface) {

        const body = JSON.stringify(styleData);
        // console.log(body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        // return this.http.post('http://192.168.1.117:3000/admin_login/loginProcess',body, {headers: headers})
        return this.http.post(`${this.baseURL}/api/customeStyle`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));

    }

    getCustomeStyle() {
        return this.http.get(`${this.baseURL}/api/getCustomeTheme`)
            .map((response: Response) => response.json())
    }

    resetFlagChange() {
        return this.http.get(`${this.baseURL}/api/resetThemeStyleFlag`)
            .map((response: Response) => response.json())
    }

    //  END COLOR CHANGE CODE

    CrossProductsCount() {

        return this.http.get(`${this.baseURL}/api/CrossProductsCount`)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));

    }

    CrossProductTypeCount(product_code: string) {
        return this.http.get(`${this.baseURL}/api/CrossProductTypeCount/` + product_code)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    setOfficeAccountLoggedIn(officeAcc: boolean) {
        this.officeAccountLoggedIn = officeAcc;
    }
    getOfficeAccountLoggedIn() {
        return this.officeAccountLoggedIn;
    }

    tokenValidation(token: string) {
        const body = JSON.stringify({ token: token });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/tokenValidation`, body, { headers: headers })
            .map((response: Response) => response.json())
    }

    Login(loginmodel: loginModel) {
        const body = JSON.stringify(loginmodel);
        // console.log(body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        // return this.http.post('http://192.168.1.117:3000/admin_login/loginProcess',body, {headers: headers})
        return this.http.post(`${this.baseURL}/api/loginProcess`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    SaveOrUpdateComment(formRecord: any) {
        const body = JSON.stringify(formRecord);
        console.log(body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        // return this.http.post('http://192.168.1.117:3000/admin_login/loginProcess',body, {headers: headers})
        return this.http.post(`${this.baseURL}/api/AddOrUpdateComment`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    AddUser(formRecord: any) {
        console.log("addinguser")
        const body = JSON.stringify(formRecord);
        console.log("addinguser...")
        console.log(body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/AddUser`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));

    }
    changePassword(formRecord: any) {
        console.log("changing password");
        const body = JSON.stringify(formRecord);
        console.log(body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/ChangePassword`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getTotalCount(camp: string, startdate: any, enddate: any) {
        return this.http.get(`${this.baseURL}/api/TotalApplications/` + camp + '/' + startdate + '/' + enddate)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    NewExistingCustomer(cmp: boolean, incmp: boolean, active: boolean, campaign: string, startdate: any, enddate: any) {
        return this.http.get(`${this.baseURL}/api/NewExistingCustomer/` + cmp + '/' + incmp + '/' + active + '/' + campaign + '/' + startdate + '/' + enddate)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getTotalCountStatus(status: string) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/botContactedFieldsForStatus/` + status)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    CompleteANDIncompleteApp(camp: string, startdate: any, enddate: string) {
        return this.http.get(`${this.baseURL}/api/CompleteANDIncompleteApp/` + camp + '/' + startdate + '/' + enddate)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    logout() {
        localStorage.clear();
    }

    assets() {
        return this.http.get(`${this.baseURL}/api/AnalyticsData`)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    applicationByProduct(cmp: boolean, incmp: boolean, active: boolean, campaign: string, startdate: any, enddate: any) {
        return this.http.get(`${this.baseURL}/api/AnalysDataOfProductTypeRequest/` + cmp + '/' + incmp + '/' + active + '/' + campaign + '/' + startdate + '/' + enddate)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    sourceOfApplication() {
        return this.http.get(`${this.baseURL}/admin_auth_api/AnalysDataOfSourceOfApplication`)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    ProspectsData() {
        return this.http.get(`${this.baseURL}/admin_auth_api/ProspectsData`)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    ApplicationPerDay() {
        return this.http.get(`${this.baseURL}/admin_auth_api/getDayPerApplication`)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    ApplicationOnDeviceType(cmp: boolean, incmp: boolean, active: boolean, campaign: string, startdate: any, enddate: any) {
        return this.http.get(`${this.baseURL}/api/ApplicationOnDeviceType/` + cmp + '/' + incmp + '/' + active + '/' + campaign + '/' + startdate + '/' + enddate)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }


    GetApplicationDetails(user: string) {
        console.log("in service" + user);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getCustDetails')
        return this.http.get(`${this.baseURL}/api/getCustDetails/` + user)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    getAttachments(user: any) {
        //const body = JSON.stringify(id);
        console.log("in ATtachments service");
        //console.log(body);
        return this.http.get(`${this.baseURL}/api/getAttachments/` + user)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));


    }
    botContactedFields(cmp: boolean, incmp: boolean, active: boolean, campaign: string, startdate: any, enddate: any) {
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getCustDetails')
        return this.http.get(`${this.baseURL}/api/botContactedFields/` + cmp + '/' + incmp + '/' + active + '/' + campaign + '/' + startdate + '/' + enddate)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    whatTime() {
        return new Date();
    }

    botContactedFieldsForStatus(status: string) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/botContactedFieldsForStatus/` + status)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getpersonalDetailsBbyId(id: number) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/getSingleCustomer/` + id)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }
    CompletedAppForAllProductType(status: string) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/CompletedAppForAllProductType/` + status)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    ApplicationOnDeviceTypeForProduct(status: string) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/ApplicationOnDeviceTypeForProduct/` + status)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getCommentbyId(id: String) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/getCommetsOnAppID/` + id)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    getFilteredApplicationDetails(filteredData: any) {
        console.log(filteredData);
        var admin_name = filteredData.admin_name;
        var campaign = filteredData.campaign || null;
        var search_key = filteredData.search_key || null;
        var application_status = filteredData.application_status || null; // in
        var Assigned_to = filteredData.Assigned_to || null;
        var product_type = filteredData.product_type || null; // in
        var Appointments = filteredData.Appointments || null;
        var product_code = filteredData.product_code || null;
        // console.log(applicant_type);
        return this.http.get(`${this.baseURL}/api/getFilteredApplicationDetails/` + application_status + '/' + product_type + '/' + search_key + '/' + Assigned_to + '/' + product_code + '/' + admin_name + '/' + campaign)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    GetAdminsDetails() {
        console.log("in adminhello");
        return this.http.get(`${this.baseURL}/api/getAdminsDetails`)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }
    postLogs(logs: any) {
        const body = JSON.stringify(logs);
        console.log("in login service");
        console.log(body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/addLogs`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));

    }
    getLogs(id: any) {
        //const body = JSON.stringify(id);
        console.log("in login service");
        //console.log(body);
        return this.http.get(`${this.baseURL}/api/getLogs/` + id)
            .map(response => response.json().Result[0])
            .catch((error: Response) => Observable.throw(error.json()));


    }


    //INCOMPLETED APPLICATION STATUS FOR PERTICULER PRODUCT TYPE STARTS HERE



    getEVRSection_1Details(product_type: String) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/section1Details/` + product_type)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    getEVRSection_2Details(product_type: String) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/section2Details/` + product_type)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    getEVRSection_3Details(product_type: String) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/section3Details/` + product_type)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }


    //HOME LOAN

    getHMLSection_1Details(product_type: String) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/section1DetailsHML/` + product_type)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    getHMLSection_2Details(product_type: String) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/section2DetailsHML/` + product_type)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    getHMLSection_3Details(product_type: String) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/section3DetailsHML/` + product_type)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    //PERSONAL LOAN

    getPRLSection_1Details(product_type: String) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/section1DetailsPRL/` + product_type)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    getPRLSection_2Details(product_type: String) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/section1DetailsPRL/` + product_type)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    getPRLSection_3Details(product_type: String) {
        // console.log(id);
        // return this.http.get('http://192.168.1.117:3000/admin_auth_api/getSingleCustomer/'+id)
        return this.http.get(`${this.baseURL}/api/section1DetailsPRL/` + product_type)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().Result));
    }

    //INCOMPLETED APPLICATION STATUS FOR PERTICULER PRODUCT TYPE ENDS HERE


    //PRODUCTS 
    getProductType() {

        return this.http.get(`${this.baseURL}/api/ProductTypes`)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getProductTypeAll() {
        return this.http.get(`${this.baseURL}/api/ProductTypesAll`)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getProduct() {
        return this.http.get(`${this.baseURL}/api/Products`)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getProductAll() {
        return this.http.get(`${this.baseURL}/api/ProductsAll`)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getCrossSellingProduct() {
        return this.http.get(`${this.baseURL}/api/CrossSellingProducts`)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    AddProductType(formRecord: any) {
        const body = JSON.stringify(formRecord);
        console.log(body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/saveProductType`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    AddProduct(formRecord: any) {
        const body = JSON.stringify(formRecord);
        console.log("Form Records inService", body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/saveProduct`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    Add_AddOn(formRecord: any) {
        const body = JSON.stringify(formRecord);
        console.log("Form Records addons inService", body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/saveAddon`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    AddCrossSellingProduct(formRecord: any) {
        const body = JSON.stringify(formRecord);
        console.log(body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/saveCrossSellingProduct`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    getSubProductDetails(subProd_id: string) {
        return this.http.get(`${this.baseURL}/api/SubProductDetails/` + subProd_id)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getProductDetails(prod_id: string) {
        return this.http.get(`${this.baseURL}/api/ProductDetails/` + prod_id)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getCrossSellingProductDetails(csProd_id: string) {
        return this.http.get(`${this.baseURL}/api/CrossSellingProductDetails/` + csProd_id)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    pushToCoreBanking(customers: any) {
        const body = JSON.stringify(customers);
        console.log(body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/pushToCore`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    talktolegacy(application_id: string, account_number: string, customer_id: string) {
        const body = JSON.stringify({ application_id: application_id, account_number: account_number, customer_id: customer_id });
        console.log(body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/talkTolegacy`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    getDistinctCrossSellProducts() {
        return this.http.get(`${this.baseURL}/api/DistinctCrossSellProduct/`)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getAllCrossSellingProducts() {
        return this.http.get(`${this.baseURL}/api/GetAllCrossSellingProducts`)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getAllUpSellingProducts() {
        return this.http.get(`${this.baseURL}/api/GetAllUpSellingProducts`)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getCrossSellDataByProductId(crossSellProductId: string) {
        return this.http.get(`${this.baseURL}/api/CrossSellingProductById/` + crossSellProductId)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getConfig() {
        return this.http.get(`${this.baseURL}/api/getConfig`)
            .map((response: Response) => response.json())

    }
    getApplicationField(){
        return this.http.get(`${this.baseURL}/api/getApplicationField`)
            .map((response: Response) => response.json())
    }
        getSectionConfig(){
        return this.http.get(`${this.baseURL}/api/getSectionConfig`)
            .map((response: Response) => response.json())
    }

    isProductDeletable(linked_crossselling_product: String, del_flg: Boolean) {
        return this.http.get(`${this.baseURL}/api/isProductDeletable/` + linked_crossselling_product + '/' + del_flg)
            .map(response => response.json().Result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getProductTypeDetails(prod_type_id: string) {
        return this.http.get(`${this.baseURL}/api/ProductTypeDetails/` + prod_type_id)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getPropertyDetails(property_type: string, property: string) {
        //GetPropertyTypes?PROPERTYTYPE=GENERIC_PROP&PROPERTY=CORE_ACCOUNT_OPENING_MODE
        return this.http.get(`${this.baseURL}/api/GetPropertyTypes/?PROPERTYTYPE=` + property_type + '&PROPERTY=' + property)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    deleteFile() {
        return this.http.get(`${this.baseURL}/api/deleteFile`)
            .map((response: Response) => response.json())
    }
    fileExists() {
        return this.http.get(`${this.baseURL}/api/fileExists`)
            .map((response: Response) => response.json())
    }
    pushFileExists() {
        return this.http.get(`${this.baseURL}/api/pushFileExists`)
            .map((response: Response) => response.json())
    }
    renameFile() {
        return this.http.get(`${this.baseURL}/api/renameFile`)
            .map((response: Response) => response.json())
    }
    getContents() {
        return this.http.get(`${this.baseURL}/api/getContent`)
            .map((response: Response) => response.json())
    }
    getLocalContents() {
        return this.http.get(`${this.baseURL}/api/getLocalContent`)
            .map((response: Response) => response.json())
    }
    setLocalContent(newData: any) {
        const body = JSON.stringify({ "newData": newData });
        console.log(body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/setLocalContent`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    GetPropertyDetails(PropertyType: String, Property: String) {
        console.log("PropertyType", PropertyType);
        console.log("Property", Property);
        return this.http.get(`${this.baseURL}/push_to_server/PropertyDetails/` + PropertyType + '/' + Property)
            .map((response: Response) => response.json())
    }
    updateProprtyDetails(PropertyType: String, Property: String, PropertyValue: String) {
        console.log("PropertyType", PropertyType);
        console.log("Property", Property);
        return this.http.get(`${this.baseURL}/api/UpdateProp/` + PropertyType + '/' + Property + '/' + PropertyValue)
            .map((response: Response) => response.json())
    }
    getFeatures() {
        //console.log("sendproductType", product_type);

        return this.http.get(`${this.baseURL}/api/getFeatures/`)
            .map((response: Response) => response.json())
    }
    updateFeatures(features: any) {
        const body = JSON.stringify(features);
        console.log("In Service Features", body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/UpdateProductFeatures`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    encrpt(app_id) {
        return this.http.get(`${this.baseURL}/api/encryption/` + app_id)
            .map((response: Response) => response.json())
    }
            getFreeFieldDetails(){
        return this.http.get(`${this.baseURL}/api/getFreeFieldDetails`)
            .map((response: Response) => response.json())
    }

        AddField(fields: any) {
        const body = JSON.stringify(fields);
        console.log("In Service Features", body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/AddField`, body, { headers: headers })
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}