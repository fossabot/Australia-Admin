import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

import { OAOadminService } from "../../../services/OAOadmin.service";
import { Customers } from "../../../interfaces/personaldetailsinterface";
import { Logs } from '../../../interfaces/adminsdetailsInterface';
import { ProductsInterface } from "../../../interfaces/product.interface";
import { AppConstants } from "../../../AppConstants";
import { ConfigDetails } from "../../../interfaces/configinterface";
declare var jQuery: any;
declare var moment: any;
declare var jsPDF;
declare var Image;
interface Dictionary {
    [index: string]: string
}
@Component({
    templateUrl: './applicationDetails.component.html'
})



export class ApplicationDetailsComponent implements AfterViewInit, OnInit {
    private pushtocore: boolean;
    customers: Customers;
    myDict: Dictionary;
    secondaryAccountDetails: Customers;
    private sub: any;
    message: string;
    formArray: any;
    user_name: any;
    created_time: any;
    work_logs: Logs;
    static app_ids;
    str_comment: string;
    fileNames: string = null;
    appid: number;
    products: ProductsInterface[];
    talktolegacy_v: boolean = false
    productTypeCodeNamePair: Map<String, String> = new Map<String, String>();
    menu: string;
    core_account_mode: string;
    allApplicationStatus: any;
    const = new AppConstants();
    configMsg: ConfigDetails;
    applicationStatusCodeNamePair: Map<String, String> = new Map<String, String>();
    constructor(private route: ActivatedRoute, private loginservice: OAOadminService) {
        this.loginservice.getConfig().subscribe((data) => {
            console.log("in subscribe");
            this.configMsg = JSON.parse(JSON.stringify(data.data));
        });

        this.menu = localStorage.getItem("menu");
        console.log("menu is" + this.menu);
        this.loginservice.getProduct().subscribe(
            (subproducts: any) => {
                this.products = subproducts;
                console.log("Products: ", this.products);
                console.log()
                for (var i = 0; i < this.products.length; i++) {
                    this.productTypeCodeNamePair.set(this.products[i].product_code, this.products[i].product_name);
                    //this.products[i].product_code_name = this.productTypeCodeNamePair.get(this.products[i].child_of);
                    //this.products[i].linked_crossselling_product_name = this.crossSellingProductCodeNamePair.get(this.products[i].linked_crossselling_product);
                    console.log(this.productTypeCodeNamePair);
                }
            }
        );

        this.loginservice.getPropertyDetails("commonCodes", "STATUS").subscribe(
            data => {
                console.log("STatus ", data);
                this.allApplicationStatus = data;
                for (var i = 0; i < this.allApplicationStatus.length; i++) {
                    this.applicationStatusCodeNamePair.set(this.allApplicationStatus[i].property_value, this.allApplicationStatus[i].property_desc);
                    console.log(this.applicationStatusCodeNamePair.get("SAV"));
                }
            },
            error => {
                console.error(error)
            });
        this.user_name = localStorage.getItem("username");
        console.log("user is" + this.user_name);
        this.pushtocore = false;
    }
    keys(): Array<string> {

        return Object.keys(this.myDict);
    }

    refresh() {
        location.reload();
    }
    changeStatus(i: any) {
        if (i == 1) {
            jQuery('#modal_verify').modal('show');
        }
        else if (i == 2) {
            jQuery('#modal_cancel').modal('show');
        }
        else if (i == 3) {
            jQuery('#modal_reject').modal('show');
        }
        else if (i == 4) {
            jQuery('#modal_verify1').modal('show');
        }
        else if (i == 5) {
            jQuery('#modal_cancel1').modal('show');
        }
        else if (i == 6) {
            jQuery('#modal_reject1').modal('show');
        }
    }
    onmousehover(i: number) {
        if (i == 1) {
            this.message = "Verifiy the application";
        }
        else if (i == 2) {
            this.message = "Cancel this application";
        }
        else if (i == 3) {
            this.message = "Reject this application";
        }
    }
    onmouseout() {
        this.message = "";
    }
    enableTextBox() {
        this.talktolegacy_v = true;
    }
    talktolegacy(app_id: string, acc: string, cfid: string) {
        console.log(app_id)
        console.log("acc:", acc + " cif:", cfid)
        this.loginservice.talktolegacy(app_id, acc, cfid).subscribe(
            data => {
                console.log(data);

                if (data.Result == "pushed") {
                    console.log("==========================================================");
                    console.log(this.customers);
                    console.log(this.customers.application_status);
                    this.loginservice.getpersonalDetailsBbyId(this.appid)
                        .subscribe(
                        //   data => {
                        //       console.log(data.result[0].name);
                        //   },
                        //   error => console.error(error)
                        (customers: Customers) => {

                            this.customers = customers;
                            this.customers[0].product_code_name = this.productTypeCodeNamePair.get(this.customers[0].product_code);

                            console.log(this.customers);
                        }
                        );
                    //this.customers.application_status=="ONBOARD";
                    this.pushtocore = true;
                    console.log(this.pushtocore);
                    setTimeout(() => {
                        this.pushtocore = false;
                    }, 6000);

                }
            }
        )
        // alert("acc:"+acc+" cif:"+cfid);
    }
    changeStatusConfirm(status: string, app_id: string, i: number) {
        console.log("STatus: ", status);
        console.log("app_id: ", app_id);
        var name = localStorage.getItem("username");
        console.log("User is" + name);
        var to;
        console.log(app_id);
        if (i == 1) {
            to = "VER"
        }
        else if (i == 2) {
            to = "CAN"
        }
        else if (i == 3) {
            to = "REJ"
        }

        this.formArray = {
            "application_id": app_id,
            "who": name,
            "from": status,
            "to": to,
            "change_type": 1
        }
        console.log("formdata");
        console.log(this.formArray);

        this.loginservice.postLogs(this.formArray)
            .subscribe(
            data => {
                console.log("Response is");
                console.log(data.Result);

                var arr = jQuery.map(data, function (el) { return el; })
                console.log(arr);

                //jQuery("#load").css("display","block");
                //jQuery( "#Assigned-List").css("display","none");

                this.customers = arr;
                jQuery('#modal_verify').modal('hide');
                jQuery('#modal_cancel').modal('hide');
                jQuery('#modal_reject').modal('hide');
                jQuery('#modal_verify1').modal('hide');
                jQuery('#modal_cancel1').modal('hide');
                jQuery('#modal_reject1').modal('hide');

            },
            error => {
                console.error(error)
            }

            )

    }
    showLogs() {
        console.log("in show logs");
        this.loginservice.getLogs(ApplicationDetailsComponent.app_ids)
            .subscribe(
            data => {
                console.log(data);
                console.log(data.logs);
                this.created_time = data.cre_time;
                // jQuery( "#logs-modal").css("display","block");
                this.work_logs = data.logs;
            },
            error => console.log(error)

            );

    }
    addComments() {
        // console.log(this.str_comment);
        //alert($(".panel-body").scrollTop() + " px");
        //alert($(".media-list").scrollTop() + " px");
        //alert($(".media").scrollTop() + " px");
        var com = this.str_comment;
        var name = localStorage.getItem("username");
        this.formArray = {
            "application_id": ApplicationDetailsComponent.app_ids,
            "who": name,
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

                setTimeout(function () { $(".table-responsive").scrollTop(10000); }, 300);


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

    ngAfterViewInit() {

        this.sub = this.route.params.subscribe(params => {

            let id = params['cust_id'];
            // console.log(id);
            ApplicationDetailsComponent.app_ids = id;
            console.log("app id is here" + ApplicationDetailsComponent.app_ids);
            this.appid = id;
            this.loginservice.getpersonalDetailsBbyId(id)
                .subscribe(

                (customers: Customers) => {

                    if (customers[0].loanreason[0]) {
                        this.myDict = customers[0].loanreason[0];
                        console.log('Loan Dict..,..', this.myDict);
                    }

                    this.customers = customers;
                    // loanReasons.map((q)=>console.log('Loan Reasons',q));
                    console.log(this.customers);
                    if (this.customers[0].singleORjoint == "joint") {
                        console.log("secondary application id: ", this.customers[0].secondaryApplicantRefID);
                        this.loginservice.getpersonalDetailsBbyId(this.customers[0].secondaryApplicantRefID)
                            .subscribe(
                            (data: Customers) => {
                                this.secondaryAccountDetails = data[0];
                                console.log("secondaryAccountDetails: ", this.secondaryAccountDetails);
                                console.log("app id: ", this.secondaryAccountDetails.application_id);
                            });
                    }
                    console.log(this.productTypeCodeNamePair.get(this.customers[0].product_code))
                    this.customers[0].product_code_name = this.productTypeCodeNamePair.get(this.customers[0].product_code);
                    console.log(this.customers[0].product_code_name)
                }
                );

        });
        this.loginservice.getAttachments(ApplicationDetailsComponent.app_ids)
            .subscribe(
            data => {
                console.log("hello")
                console.log(data);
                if (data.Result == "null" || data.Result == null) {
                    console.log("no documents found");
                }
                else {
                    console.log("in else result");
                    console.log(data.Result.fileNames);
                    this.fileNames = data.Result.fileNames;

                }
            },
            error => console.log(error)
            );

        this.loginservice.getLogs(ApplicationDetailsComponent.app_ids)
            .subscribe(
            data => {
                console.log("response isjhh");
                console.log(data);
                console.log("hi");
                console.log(data.logs);
                console.log("hi cheknng");
                this.created_time = data.cre_time;
                /*this.completed_time= data.completion_time;
                this.completed_by= data.completed_by;
                this.resume_time=data.resume_time;
                console.log("resumes")
                console.log(this.resume_time);*/

                // jQuery( "#logs-modal").css("display","block");
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




        jQuery("body").on("click", "#myImg", function () {
            console.log("clicked image");

            jQuery('.modal1').css("display", "block");

            jQuery("#img01").attr("src", this.src);

        });

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


        jQuery("#filter-List").click(function () {
            jQuery("#filter-List-elms").toggle();
        });

        jQuery('body').on('contextmenu', 'img', function (e) {
            return false;
        });


        jQuery("body").on("click", ".close2", function () {

            jQuery('.modal1').css("display", "none");
        });

        jQuery(function () {
            jQuery('[data-toggle="tooltip"]').tooltip()
        })

    }
    public download(appid) {



        console.log(appid);
        console.log("downloading....pdf");
        var img = new Image();
        img.src = '/assets/images/logo.png';
        var doc = new jsPDF();
        // doc.addImage(img, 'png', 10, 50);
        // doc.text(x, x, 'Personal Details');
        doc.fromHTML($('#content1').html(), 15, 15, {
            'width': 170
        });
        //  doc.text(x, x+160, 'Loan Details');
        //   doc.fromHTML($('#loantemplate').html(), 15, 175, {
        //     'width': 170
        // });
        //   doc.text(x+20, x+20, 'Property Details');
        //    doc.fromHTML($('#propertytemplate').html(), 15, 15, {
        //     'width': 170
        // });
        // Save the PDF
        doc.save(appid + '.pdf');
    }



    exportAll(type, appid) {

        console.log("downloading.." + type)
        console.log(appid)
        jQuery("#excel").tableExport({
            filename: appid,
            format: type
        });

    }
    pushToCore() {
        this.loginservice.pushToCoreBanking(this.customers).subscribe(
            data => {
                console.log(data.Result)

                if (data.Result == "pushed") {
                    console.log("==========================================================");
                    console.log(this.customers);
                    console.log(this.customers.application_status);
                    this.loginservice.getpersonalDetailsBbyId(this.appid)
                        .subscribe(
                        //   data => {
                        //       console.log(data.result[0].name);
                        //   },
                        //   error => console.error(error)
                        (customers: Customers) => {

                            this.customers = customers;
                            this.customers[0].product_code_name = this.productTypeCodeNamePair.get(this.customers[0].product_code);

                            console.log(this.customers);
                        }
                        );
                    //this.customers.application_status=="ONBOARD";
                    this.pushtocore = true;
                    console.log(this.pushtocore);
                    setTimeout(() => {
                        this.pushtocore = false;
                    }, 3000);

                }

            }
        )

    }
    takeOwnership(app_id: string) {

        this.loginservice.encrpt(app_id).subscribe(
            data => {
                console.log(data);
                var encryptapp_id = data.key;
                console.log(this.configMsg.url.clientUrl);
                var url = this.configMsg.url.clientUrl + "/home/" + this.user_name + "/" + encryptapp_id;
                window.open(url, "_blank");
            }
        )

    }
    setPropertyDetails() {
        var PROPERTY_TYPE = 'GENERIC_PROP';
        var PROPERTY = 'CORE_ACCOUNT_OPENING_MODE';
        this.loginservice.getPropertyDetails(PROPERTY_TYPE, PROPERTY).subscribe(
            data => {
                this.core_account_mode = data[0].property_value;
                console.log('Core account mode', this.core_account_mode);
            },
            error => {
                console.error(error)
            });

    }
    ngOnInit() {
        this.setPropertyDetails();
    }

}