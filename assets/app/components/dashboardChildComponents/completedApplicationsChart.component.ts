import { Component, OnInit, AfterViewInit,ViewContainerRef } from '@angular/core';
import { OAOadminService } from "../../services/OAOadmin.service";
import { Router } from "@angular/router";
import { ProductsInterface } from "../../interfaces/product.interface";
import {DashboardComponent} from "../dashboard.component"

declare var google: any;
declare var googleLoaded: any;

declare var jQuery: any;
declare var moment: any;

@Component({
  selector: 'dashboard_chart2',
  templateUrl: './totalApplicationsChart.component.html'

})

export class CompletedApplicationsChartComponent implements AfterViewInit {
  
 public chartColors: any[] = [
      { 
        backgroundColor:["#109618", "#ff9900", "#990099", "#dc3912", "#3366cc"] 
      }];  
  public chart_proFlag: boolean;
  public chart_sourFlag: boolean;
  public chart_custFlag: boolean;
  public chart_appFlag: boolean;
  public chart_remindFlag: boolean;
 
  public barChartType: string;
  public barChartLegend: boolean;
  public barChartLabels: string[];
  public barChartData: any[];
  public sourChartData: any[];
  public sourChartLabels: string[];
  public custChartData: any[];
  public custChartLabels: string[];
  public remindChartData: any[];
  public remindChartLabels: string[];

  private No_CONTACT: number = 0;
  private FST: number = 0;
  private SCND: number = 0;
  private THRD: number = 0;

  private ET: number;
  private HL: number;
  private PL: number;

  private WEB: number;
  private BOT: number;
  private MB: number;
  private BT: number;

  private _EXISTING_USER: number;
  private NEW_USER: number;
  public NullVal: number;

  private Sunday: number = 0;
  private Monday: number = 0;
  private Tuesday: number = 0;
  private Wednesday: number = 0;
  private Thursday: number = 0;
  private Friday: number = 0;
  private Saturday: number = 0;

  TotalApplications: boolean;
  products: ProductsInterface[];
  productTypeCodeNamePair: Map<String, String> = new Map<String, String>();
  productTypeCodeNamePairchart2: Map<String, String> = new Map<String, String>();
  productTypeCodeNamePairchart2Dropdown: Map<String, String> = new Map<String, String>();
  public tempDatasetLabel = [];
  public tempDataset = [];
  public service: OAOadminService;
  public route: Router;
  static view_ref :any;
  status: string;

  constructor(private loginservice: OAOadminService, private router: Router,private viewContainerRef: ViewContainerRef) {
    this.status = localStorage.getItem("status");
    jQuery("#no-data").css("display","none");
    console.log("FLag in totalappplication is ",DashboardComponent.flag);
    setTimeout(() => {
    console.log("FLag in totalappplication is ",DashboardComponent.flag);
    this.TotalApplications = DashboardComponent.flag_cmp;
   if(!(DashboardComponent.flag_cmp))
    {
     //console.log("in if flag condition");
      
       // jQuery(".tab-content").css("display","none"),
      jQuery("#no-data").css("display","block")
    }
    }
    ,100);
    this.barChartType = 'doughnut';
    this.barChartLegend = false;
    this.service = loginservice;
    this.route = router;
    console.log("in Completecharts");
    this.loginservice.getProduct().subscribe(
      (subproducts: any) => {
        console.log("found products in completec hart");
        this.products = subproducts;
        console.log("Products: ", this.products);

        for (var i = 0; i < this.products.length; i++) {
          this.productTypeCodeNamePair.set(this.products[i].product_code, this.products[i].product_name);
        //  this.productTypeCodeNamePairchart2.set(this.products[i].product_code, this.products[i].product_name);
        //  this.productTypeCodeNamePairchart2Dropdown.set(this.products[i].product_code, this.products[i].product_name);
          //this.products[i].product_code_name = this.productTypeCodeNamePair.get(this.products[i].child_of);
          //this.products[i].linked_crossselling_product_name = this.crossSellingProductCodeNamePair.get(this.products[i].linked_crossselling_product);
          //console.log(this.productTypeCodeNamePair);
        }
        console.log(this.productTypeCodeNamePair);
      }
    );
    // console.log(status);

    // if(this.status!="Authenticated")
    // {
    //     this.router.navigate(['/dashboard']);  
    // }

  }
  ngAfterViewInit() {
    console.log("IN ng after view int completed");
    var camp = DashboardComponent.camp_id;
    var startdate = DashboardComponent.start_value;
    var endate =DashboardComponent.end_value;

    this.loginservice.botContactedFields(true, false, false,camp,startdate,endate)
      .subscribe(
      data => {
        var remind = [];
        var count = [];
        var c =0;
        console.log("heloo");
        console.log(data);
         var promise = new Promise((resolve, reject) => {
        for (var i in data.Result) {
          console.log("i is " + i);
          if(data.Result[i]._id == "0")
          remind.push("None");
          if(data.Result[i]._id == "1")
          remind.push("One");
          if(data.Result[i]._id == "2")
          remind.push("Two");
          if(data.Result[i]._id == "3")
          remind.push("Three");
          //remind.push(data.Result[i]._id);
          count.push(data.Result[i].count);
          //count++;
          c++;


        }
        if(c == data.Result.length)
            resolve("done pushhing to arrays");
            }).then((e)=>{
        this.remindChartLabels = remind;
    this.chart_remindFlag = true;
    this.remindChartData = count;
            });

      },
      error => console.error(error)
      );


    this.loginservice.NewExistingCustomer(true, false, false,camp,startdate,endate)
      .subscribe(
      data => {
        var custype = [];
        var count = [];
        var c = 0;
        console.log("sample check111")
        console.log(data);
         var promise = new Promise((resolve, reject) => {
        for (var i in data.Result) {
          console.log("i is " + i);
          if(data.Result[i]._id == 'N')
          custype.push("New");
          else
          custype.push("Existing");
          count.push(data.Result[i].count);
         c++;


        }
        if(c == data.Result.length)
            resolve("done pushhing to arrays");
            }).then((e)=>{
       this.custChartLabels = custype;
    this.chart_custFlag = true;
    this.custChartData = count;
            });

      },
      error => console.error(error)
      );
        setTimeout(()=>{
        this.loginservice.applicationByProduct(true,false,false,camp,startdate,endate)
          .subscribe(
          data => {
            var c =0;
            console.log('sample');
            console.log(data);
            var promise = new Promise((resolve, reject) => {
            for (var i in data.Result) {
              console.log("i is " + i);
              // console.log(results.Result[i]._id);
              // console.log(this.productTypeCodeNamePair.get(results.Result[i]._id));
              data.Result[i]._id = this.productTypeCodeNamePair.get(data.Result[i]._id);
    
              this.tempDatasetLabel.push(data.Result[i]._id);
              this.tempDataset.push(data.Result[i].count);
              c++;


        }
        if(c == data.Result.length)
            resolve("done pushhing to arrays");
            }).then((e)=>{
           // console.log(this.tempDatasetLabel);
            //console.log(this.tempDataset);
            this.barChartLabels = this.tempDatasetLabel;
            this.chart_proFlag = true;
            this.barChartData = this.tempDataset;
            });
          },
          error => console.error(error)
          );
        },300);
  
    this.loginservice.ApplicationOnDeviceType(true, false, false,camp,startdate,endate)
      .subscribe(
      data => {
        var device = [];
        var count = [];
        var c =0;
        console.log("device type");
        console.log(data);
         var promise = new Promise((resolve, reject) => {
        for (var i in data.Result) {
          console.log("i is " + i);
          device.push(data.Result[i]._id);
          count.push(data.Result[i].count);
         c++;


        }
        if(c == data.Result.length)
            resolve("done pushhing to arrays");
            }).then((e)=>{
      this.sourChartLabels = device;
      this.chart_sourFlag = true;
      this.sourChartData = count;
            });

      },
      error => console.error(error)
      );

    this.loginservice.ApplicationPerDay()
      .subscribe(
      data => {

        if (data.result.length == 7) {
          this.Friday = data.result[0].count;
          this.Monday = data.result[1].count;
          this.Saturday = data.result[2].count;
          this.Sunday = data.result[3].count;
          this.Thursday = data.result[4].count;
          this.Tuesday = data.result[5].count;
          this.Wednesday = data.result[6].count;

          //  drawVisualization(this.Friday,this.Monday,this.Saturday,this.Sunday,this.Thursday,this.Tuesday,this.Wednesday);
        }
        else {
          // drawVisualization(this.Friday,this.Monday,this.Saturday,this.Sunday,this.Thursday,this.Tuesday,this.Wednesday);
        }

      },
      error => console.error(error)
      );






    jQuery("#closemenu").click(function (e) {
      e.preventDefault();
      jQuery("body").toggleClass("collapse-main");
    });

    jQuery('.filter-btns .btn').on('click', function () {
      jQuery('.filter-btns .btn').removeClass('active');
      jQuery(this).addClass('active');
      var getId = jQuery(this).attr('name');
      jQuery('.bar-charts').hide();
      jQuery("#" + getId).show();
      if (getId == "chart_div3") {
        jQuery("#cur-month").show();
      } else {
        jQuery("#cur-month").hide();
      }
    });
    



  }
  //setTimeout(()=>{
 
}