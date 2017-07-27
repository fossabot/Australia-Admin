import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";

// import {TitleCasePipe} from '../pipes/TitleCase.Component';

// import appConstant=require('../../../../../routes/AppConstants');

import { OAOadminService } from "../../../services/OAOadmin.service";

import { Customers } from "../../../interfaces/Customer.interface";
import { CommetsInterface } from "../../../interfaces/comments.interface";
import { Admins } from "../../../interfaces/adminsdetailsInterface";
import { LogsForm } from '../../../interfaces/adminsdetailsInterface';
import { Logs } from '../../../interfaces/adminsdetailsInterface';
import { ProductsTypeInterface } from "../../../interfaces/productType.interface";
import { ProductsInterface } from "../../../interfaces/product.interface";
import { AppConstants } from "../../../AppConstants";

declare var jQuery: any;
declare var moment: any;

@Component({
    templateUrl: './application.component.html'

})

export class ApplicationComponent implements AfterViewInit {
    allApplicationStatus: any;
    products: ProductsInterface[];
    productTypes: ProductsTypeInterface[];
    productTypeCodeNamePair: Map<String, String> = new Map<String, String>();
    applicationStatusCodeNamePair: Map<String, String> = new Map<String, String>();
    menu: string;
    logsForm: FormGroup;
    somevar: boolean;
    //myFormSerach: FormGroup;
    static idno: string;
    static oldstatus: string;
    static oldassigned: string;
    static prev_oldassigned:string = null;
    static assigned_table = false;
    static app_ids: string;

    str_comment: string;
    myForm: FormGroup;
    myFormSerach: FormGroup;
    formArray: any;
    adminname: string;
    formRecordArray: any;
    public flagset: string;
    public url: any;
    public validflag: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    created_time: any;
    term: String;
    Status: String;
    modal: String;
    whatTime: any;
    date;
    timerSubscription: any;
    static flag = 0;
    static clas: any;
    name: string;
    customers: Customers[];
    assigned_customers: Customers[];
    model = new CommetsInterface('', '');

    admins: Admins;
    static passadmins: Admins;
    work_logs: Logs;

    const = new AppConstants();
    model1 = new LogsForm('', '', '', '');
    logs_model = new Logs('', '', '', '', '', null);
    
    constructor(private loginservice: OAOadminService) {
        console.log(this.const.ACTIVE);

        console.log("menu option is" + localStorage.getItem("menu"));
        this.menu = localStorage.getItem("menu");
        // this.getProductTypes();
        //  this.loginservice.getProduct().subscribe(
        //     (productTypes: any) => {
        //         this.productTypes = productTypes;
        //         console.log("Product types product component m: " + this.productTypes);
        //         for (var i = 0; i < this.productTypes.length; i++) {
        //             this.productTypeCodeNamePair.set(this.productTypes[i].product_type_code, this.productTypes[i].product_type_name)
        //             console.log(this.productTypeCodeNamePair);
        //         }

        //     }
        // )


        this.loginservice.getProductTypeAll().subscribe(
            (productTypes: any) => {
                this.productTypes = productTypes;
                //  console.log("Product types product component m: " , this.productTypes);


            }
        )

        this.loginservice.getProductAll().subscribe(
            (subproducts: any) => {
                this.products = subproducts;
                //console.log("Products: " , this.products);

                for (var i = 0; i < this.products.length; i++) {
                    this.productTypeCodeNamePair.set(this.products[i].product_code, this.products[i].product_name);
                   // this.products[i].product_code_name = this.productTypeCodeNamePair.get(this.products[i].child_of);
                    //this.products[i].linked_crossselling_product_name = this.crossSellingProductCodeNamePair.get(this.products[i].linked_crossselling_product);
                    // console.log(this.productTypeCodeNamePair);
                }
            }
        );


        this.name = localStorage.getItem("username");

        this.adminname = this.name;
        //console.log(this.name + "logged in");
        this.loginservice.GetApplicationDetails(this.name)
            .subscribe(
            data => {
                //console.log("sample"+data[0]);
                this.customers = data.Result;
                console.log("all customers");
                console.log(this.customers);
                if (data.Result.length <= 0) {
                    jQuery('.no-row').show();
                }
                else {
                    jQuery('.no-row').hide();
                }

                //jQuery('.no-row').hide();
                console.log("another result", data.Another_Result.length);
                if (data.Another_Result.length >= 1) {
                    jQuery(".no-assigned").hide();
                    this.assigned_customers = data.Another_Result;
                    console.log("assigned customers");
                    console.log(this.assigned_customers);
                }
                else {
                    console.log("in else after if");
                    jQuery(".no-assigned").show();
                }
                if (this.customers.length >= 1) {
                    for (var i = 0; i < this.customers.length; i++) {
                        // console.log("////////////////////////")
                        //  console.log(this.productTypeCodeNamePair.get(this.customers[i].product_code))
                        this.customers[i].product_code_name = this.productTypeCodeNamePair.get(this.customers[i].product_code);
                        if (data.Another_Result.length >= 1) {
                            if (i < this.assigned_customers.length)
                                this.assigned_customers[i].product_code_name = this.productTypeCodeNamePair.get(this.assigned_customers[i].product_code);

                        }
                    }
                }
                 else{
                     if(data.Another_Result.length >=1)
                     {
                     for (var i = 0; i < data.Another_Result.length; i++) {
                          if (i < this.assigned_customers.length)
                                this.assigned_customers[i].product_code_name = this.productTypeCodeNamePair.get(this.assigned_customers[i].product_code);

                        }
                     }
                 }
                    //  console.log("======");
                    //  console.log(this.customers[i].product_code_name)
                    // this.customers[i].linked_crossselling_product_name = this.crossSellingProductCodeNamePair.get(this.products[i].linked_crossselling_product);
                // else{
                //     jQuery('.no-row').show();
                //      jQuery(".no-assigned").show();

                // }

            },
            error => console.error(error)
            /* (customers: Customers[]) => {
                 this.customers = customers;
                  console.log("Customers: ",JSON.stringify(this.customers));
                  for (var i = 0; i < this.customers.length; i++) {
                      console.log("////////////////////////")
                     console.log(this.productTypeCodeNamePair.get(this.customers[i].product_code))
                 this.customers[i].product_code_name = this.productTypeCodeNamePair.get(this.customers[i].product_code);
                 console.log("======");
                 console.log(this.customers[i].product_code_name)
                // this.customers[i].linked_crossselling_product_name = this.crossSellingProductCodeNamePair.get(this.products[i].linked_crossselling_product);

             }


          }*/
            );
        this.loginservice.GetAdminsDetails()
            .subscribe(
            // data => {
            //this.admins = data;
            // console.log(data);
            //},
            //   error => console.error(error)
            (admins: Admins) => {
                this.admins = admins;
                ApplicationComponent.passadmins = admins;
                console.log('All admin', this.admins);


            }
            );
        this.loginservice.getPropertyDetails("commonCodes", "STATUS").subscribe(
            data => {
                console.log("STatus ", data);
                this.allApplicationStatus = data;
                for (var i = 0; i < this.allApplicationStatus.length; i++) {
                    this.applicationStatusCodeNamePair.set(this.allApplicationStatus[i].property_value, this.allApplicationStatus[i].property_desc);
                    console.log(this.applicationStatusCodeNamePair.get(this.allApplicationStatus[i].property_value));
                }
            },
            error => {
                console.error(error)
            });

        this.whatTime = Observable.interval(1000).map(x => new Date()).share();



    }

    getProductTypes() {
        this.loginservice.getProductTypeAll().subscribe(
            (productTypes: any) => {
                this.productTypes = productTypes;
                console.log("Product types product component m: " + this.productTypes);
                for (var i = 0; i < this.productTypes.length; i++) {
                    this.productTypeCodeNamePair.set(this.productTypes[i].product_type_code, this.productTypes[i].product_type_name)
                }

            }
        )
    }
    clearData() {
        jQuery("#filter-List-elms").hide();
    }
    clearFilter() {
        this.myForm.reset();
        /*this.loginservice.GetApplicationDetails(name)
               .subscribe(
               //   data => {
               //       console.log("sample"+data[0]);
               //   },
               //   error => console.error(error)
               (customers: Customers) => {
                   this.customers = customers;
                   // console.log(this.customers);
               }
               ); */
    }

	/*reload_data(): Customers{
         this.loginservice.GetApplicationDetails()
                .subscribe(
                //   data => {
                //       console.log("sample"+data[0]);
                //   },
                //   error => console.error(error)
                (customers: Customers) => {
                    this.customers = customers;
                    this.model1.comments ='';

                    jQuery( "#load").css("display","none");
                    
                    // console.log(this.customers);
                }
                ); 

              return this.customers;
    }*/

    refresh() {
        location.reload();
    }



    onSubmit() {
        // console.log(this.myForm.value);

        this.formRecordArray = {
            "application_status": this.myForm.value.application_status,
            "search_key": this.myForm.value.search,
            "product_type": this.myForm.value.product_type,
            "admin_name": this.name,
            "campaign": this.myForm.value.campaign_id,
            //"currentSection":this.myForm.value.currentSection,
            "Assigned_to": this.myForm.value.Assigned_to,
            "product_code": this.myForm.value.currentSection
        }
        //console.log("hell");
        console.log(this.formRecordArray);

        this.loginservice.getFilteredApplicationDetails(this.formRecordArray)
            .subscribe(
            data => {
                jQuery("#filter-List-elms").hide();
                if (data != null) {
                    console.log(data);
                    jQuery(".no-row").hide();
                    this.customers = data;
                    for (var i = 0; i < this.customers.length; i++) {
                        this.customers[i].product_code_name = this.productTypeCodeNamePair.get(this.customers[i].product_code);
                    }
                }
                else {
                    this.customers = [];
                    jQuery(".no-row").show();

                    console.log("null aa rha h");
                }
            },
            error => {
                console.error(error)
            }
            /*(customers: Customers) => {
                    
                    this.customers = customers;
                     //console.log(this.customers);
            }*/
            )

        // console.log(this.formRecordArray);
        // this.myForm.reset();
    }

    /*refreshData(): void {
        console.log("refresh data");
     this.loginservice.GetApplicationDetails(this.name).subscribe((customers: Customers) => {
     this.customers = customers;
     //console.log(this.customers);
     this.subscribeToData();
    }); 
        
    }

 subscribeToData(): void {
  //console.log("in refresh to subscscribe");
    //this.timerSubscription = Observable.timer(5000).first().subscribe(() => this.refreshData());
}*/
	/*
	onLogsSubmit(event:Event){
    event.preventDefault();
    console.log("sasain logssubm");

     //console.log("id is"+ this.model1);
     //console.log(this.model1);
     console.log($("#id_app").val());

     var status;

     var selectedid=$("#id_app").val();
     var selectedstatus = $("#dropdown").val();
     var selectedassigned =  $("#assign_drop").val();
     var comments = this.model1.comments;

     console.log("id number is  " + ApplicationComponent.idno);
    
     var oldstatusconcat = ApplicationComponent.oldstatus;
     
     var oldconcatassigned = ApplicationComponent.oldassigned;

     var from1 = null;
     var to1 = null;
     var from = null;
     var to = null;

     console.log("selected status" + selectedstatus);
     console.log("old status" + oldstatusconcat);

     console.log("selected assigne" + selectedassigned);
     console.log("old assign" + oldconcatassigned);


     if((selectedstatus !== oldstatusconcat)&&(selectedassigned === oldconcatassigned))
    {
        status = 1;
        from = oldstatusconcat;
        to=selectedstatus;
    }
    else if((selectedstatus === oldstatusconcat)&&(selectedassigned !== oldconcatassigned))
    {
        status = 2;
        from= oldconcatassigned;
        to = selectedassigned;

    }
    else if((selectedstatus !== oldstatusconcat)&&(selectedassigned !== oldconcatassigned))
    {
        status = 3;
        from = oldstatusconcat;
        to = selectedstatus;
        from1 = oldconcatassigned;
        to1 =  selectedassigned; 
    }
  
            var name = localStorage.getItem("username");
            console.log("User is" + name);
            this.formArray={
            "application_id" :selectedid,
            "who" : name,
            "from":from,
            "to":to,
            "change_type": status,
            "comments":comments,
            "from1": from1,
            "to1": to1
            }
            console.log("formdata"); 
            console.log(this.formArray);

            this.loginservice.postLogs(this.formArray)
            .subscribe(
                data =>{
                    console.log("Response is");
                     console.log(data);  
                     
                     jQuery("#load").css("display","block");
                     jQuery( "#Assigned-List").css("display","none");
                    
                   
                      
                                  
                 },
                 error =>{
                console.error(error)
                }

            )
    }*/

    showLogs(id_name: any, id_attr: any) {
        //console.log(id_attr);
        ApplicationComponent.idno = id_attr;
        var y = id_name;
        var z = y.concat(ApplicationComponent.idno);
        console.log(z);
        // console.log("id is" + jQuery(z).text());
        ApplicationComponent.app_ids = jQuery(z).text();

        console.log("appID is" + ApplicationComponent.app_ids)
        //console.log( this.values );

        this.loginservice.getLogs(ApplicationComponent.app_ids)
            .subscribe(
            data => {
                console.log("response isjhh");
                console.log(data);
                console.log("hi");
                console.log(data.logs);
                console.log("hi cheknng");
                this.created_time = data.cre_time;
                /*
                this.completed_time= data.completion_time;
                this.completed_by= data.completed_by;
                this.resume_time=data.resume_time;
                console.log("resumes")
                console.log(this.resume_time);*/

                jQuery("#logs-modal").css("display", "block");
                this.work_logs = data.logs;
            },
            error => console.log(error)
            /* (work_logs: Logs) => {
                console.log("response isjhh");
                console.log(work_logs);
                jQuery( "#logs-modal").css("display","block");
               this.work_logs = work_logs.Logs;
               // console.log(this.work_logs);
            }*/
            );


    }
    addComments() {
        // console.log(this.str_comment);
        //alert($(".panel-body").scrollTop() + " px");
        //alert($(".media-list").scrollTop() + " px");
        //alert($(".media").scrollTop() + " px");
        var com = this.str_comment;
        // var name = localStorage.getItem("username");
        this.formArray = {
            "application_id": ApplicationComponent.app_ids,
            "who": this.name,
            "from": null,
            "to": null,
            "change_type": null,
            "comments": com
        }
        //  console.log("formdata"); 
        // console.log(this.formArray);

        this.loginservice.postLogs(this.formArray)
            .subscribe(
            data => {
                this.str_comment = '';
                // console.log("Response is");
                //console.log(data); 
                //console.log(data.Result.logs);
                this.work_logs = data.Result.logs;
                // console.log($(".panel-body")[0].scrollHeight);  

                setTimeout(function () { $(".panel-body").scrollTop(10000); }, 300);


                // location.reload();        
            },
            error => {
                console.error(error)
            }
            //(work_logs: Logs) => {
            //  console.log("response isjhh");
            //jQuery( "#logs-modal").css("display","block");
            //this.work_logs = work_logs;
            //console.log(this.work_logs);
            //}

            );
    }
    getinitialAssign(id: string, val: string, appid: any, e: Event) {


        console.log(e.srcElement.id);
        
        if(e.srcElement.id.match("assigned_val") ){
            console.log("below table");
        ApplicationComponent.assigned_table=true;
        }
        else
        ApplicationComponent.assigned_table=false;
        //   console.log("assasaa121"+appid);
        // this.flagset=appid;
        console.log("Hellomodela" + val);
        console.log("hi" + id);
        ApplicationComponent.idno = id;
        //var s = "#valid-";
        //ApplicationComponent.clas = s.concat(id);
        //jQuery(ApplicationComponent.clas).addClass("disable");  
        //this.validflag = 0;
        this.validflag[id] = 0;
       console.log("BEFROE",ApplicationComponent.oldassigned , val);
        ApplicationComponent.oldassigned =val;
        console.log(ApplicationComponent.oldassigned);
        


    }
    // onAdminChange(username: string) {
    //     this.adminname = username;
    // }
    // isStatusChanged:boolean;
    //isStatusChanged=false;
    /*  onKeyPress(n:number,i:string,assign:any)
      {
        

        if(n == 13)
        this.changeAssign(i,assign);
        isStatusChanged=true;

      }*/
    changeAssign(app_id: string, i: string, assign: any, mine: any) {
      
        let assigned;
       var yid;
        console.log("inchangeAssign how" + mine);
        //$("input#assign_val").blur();
        console.log("ass is" + assign + "and flag is " + ApplicationComponent.flag, this.adminname);
        if (mine) {
            ApplicationComponent.oldassigned = assign;
            assign = this.adminname;
           
            ApplicationComponent.idno = i;
            ApplicationComponent.flag = 1;
            

        }
        if(ApplicationComponent.assigned_table){
        yid = "#assigned_val-";
   // this.validflag[i] = 1    
    }
        else
             yid = "#assign_val-"
        
        if (ApplicationComponent.flag == 1) {

            //console.log("asignment is pl "+ ApplicationComponent.assign_val);
            //console.log("sasa");
            //console.log("i is" + i);
            // ApplicationComponent.idno = i;

            //this.validflag =1;
            // this.flagset=null;
            //jQuery(ApplicationComponent.clas).removeClass("disable");

            this.validflag[i] = 1;
            var y = app_id;
            var z = y.concat(ApplicationComponent.idno);
            //console.log(jQuery(z).text());
            ApplicationComponent.app_ids = jQuery(z).text();

            assigned = assign;
            //console.log(" new assigned"+ assigned);



            var from = ApplicationComponent.oldassigned;
            var to = assigned;
            //console.log(this.admins);
            if (from !== to) {
                //var name = localStorage.getItem("username");
                //console.log("User is" + name);
                  jQuery('.overlay').show();
                    jQuery('#load').show();
                this.formArray = {
                    "application_id": ApplicationComponent.app_ids,
                    "who": this.name,
                    "from": from,
                    "to": to,
                    "dropdown_val": this.adminname,
                    "flag": 1,
                    "change_type": 2
                }
                //console.log("formdata"); 
                //console.log(this.formArray);

                this.loginservice.postLogs(this.formArray)
                    .subscribe(
                    data => {
                        //console.log("Response is");
                        //console.log(data);  

                        this.customers = data.totalApplication;
                        this.assigned_customers = data.Result;

                        for (var i = 0; i < this.customers.length; i++) {
                            this.customers[i].product_code_name = this.productTypeCodeNamePair.get(this.customers[i].product_code);
                            if (i < (this.assigned_customers).length)
                                this.assigned_customers[i].product_code_name = this.productTypeCodeNamePair.get(this.assigned_customers[i].product_code);

                        }
                        // var arr = jQuery.map(data, function(el) { return el; })
                        // this.customers = arr;

                        // this.refreshData();
                        //jQuery("#load").css("display","block");
                        //jQuery( "#Assigned-List").css("display","none");

                        //
                        if(this.customers.length >=1)
                        {
                            jQuery('.no-row').hide();
                        }
                        else
                        {
                            jQuery('.no-row').show();
                        }
                        if(this.assigned_customers.length >=1)
                        {
                            jQuery(".no-assigned").hide();
                        }
                        else{
                             
                             jQuery(".no-assigned").show();
                        }
                       
                        jQuery('.overlay').hide();
                        jQuery('#load').hide();
                    },
                    error => {
                        console.error(error)
                    }

                    )
            }
            else{
                console.log("Assign to someone new");
            }
        }
        else{
           
            let z = yid.concat(ApplicationComponent.idno);
            jQuery(z).val(ApplicationComponent.oldassigned)
           // jQuery(z).trigger('input');
           if(ApplicationComponent.assigned_table){
            this.validflag[i] = 1    
            }
            $(z)[0].dispatchEvent(new Event("input", { bubbles: true }));
            //angular.element(jQuery('#myInputElement')).triggerHandler('input')
            //jQuery(z).val(ApplicationComponent.oldassigned);
        }

    }

    /*SaveUpdateComments(formRecord:CommetsInterface){
        // console.log(formRecord);
        this.loginservice.SaveOrUpdateComment(formRecord)
        .subscribe(
            data=>{
                // console.log(data.Result);
                this.Status=data.Result;
                setTimeout(() => {  
                        this.Status="";
                }, 3000);

            },
            error=>{
                console.error(error);
            }
        )

    }*/
    getAppID(app_id: String) {
        this.model.application_id = app_id;
        this.model.comment = ""
        this.loginservice.getCommentbyId(app_id)
            .subscribe(
            data => {
                this.model.comment = data;
            },
            error => {
                console.error(error);
            }
            )
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            // applicant_type: new FormControl(null,Validators.required),
            application_status: new FormControl(null, Validators.required),
            Assigned_to: new FormControl(null, Validators.required),
            product_type: new FormControl(null, Validators.required),
            search: new FormControl(null, Validators.required),
            campaign_id: new FormControl(null, Validators.required),
            currentSection: new FormControl(null, Validators.required)

        });


    }

    ngAfterViewInit() {
        //jQuery("#id_assign").val(this.name);
        //this.myForm.patchValue({Assigned_to:this.name,search:this.name});
        // console.log("name issss" + this.name);
        //    this.loginservice.GetApplicationDetails(this.name)
        //         .subscribe(
        //         //   data => {
        //         //       console.log("sample"+data[0]);
        //         //   },
        //         //   error => console.error(error)
        //         (customers: Customers) => {
        //             this.customers = customers;
        //             // console.log(this.customers);
        //         }
        //         ); 

        //     jQuery(window).load(function() {
        // 	// Animate loader off screen
        // 	jQuery(".se-pre-con").fadeOut("slow");;
        // });

        jQuery("#menu-toggle").click(function (e) {
            e.preventDefault();
            jQuery("body").toggleClass("collapse-main");
        });
        jQuery("#sidebar-close,.overlay").click(function () {
            jQuery("body").removeClass("collapse-main");
        });

        jQuery("#closeOnclick,.overlay").click(function () {
            jQuery("body").removeClass("collapse-main");
        });

        jQuery("#closemenu").click(function (e) {
            e.preventDefault();
            jQuery("body").toggleClass("collapse-main");
        });


        jQuery("#filter-List").click(function () {


            jQuery("#filter-List-elms").toggle();
        });

		/*jQuery( "body" ).on("click","#assign-Form",function() {
            
            //jQuery( "#Assigned-List").css("display","block");
            //console.log("sa");
            ApplicationComponent.idno = jQuery(this).closest('li').attr('id').substring(5);
            console.log(ApplicationComponent.idno);
            var y = "#id-";
            //var w = "#stat-";
            //var v = w.concat(ApplicationComponent.idno);
            var z = y.concat(ApplicationComponent.idno);
            //console.log(z);
            console.log(jQuery(z).text());
            ApplicationComponent.app_ids = jQuery(z).text();
            //jQuery("#id_app").val(Application.app_ids); 

            //console.log(this.model);
            //this.model.id=id_v;

           // console.log(v); 
            //console.log($.trim(jQuery(v).text()));
            //ApplicationComponent.oldstatus = $.trim(jQuery(v).text());
            //jQuery("#dropdown").val(ApplicationComponent.oldstatus);

           

            var assigned ="#assign-";
            var finalassignedid =  assigned.concat(ApplicationComponent.idno);
            console.log(finalassignedid);
            ApplicationComponent.oldassigned = $.trim(jQuery(finalassignedid).text());
            console.log(ApplicationComponent.oldassigned);
            jQuery("#assign_drop").val(ApplicationComponent.oldassigned);

  
            
     

            


        });*/

        jQuery("body").on("click", ".close1", function () {

            jQuery("#Assigned-List,#logs-modal").css("display", "none");

        });



        /* window.onclick = function(event) {
     if (event.target == (jQuery("#Assigned-List"))) {
         jQuery("#Assigned-List").css("display","none");
     }    
         }*/

        jQuery(function () {
            jQuery('[data-toggle="tooltip"]').tooltip()
        })


    }
}
