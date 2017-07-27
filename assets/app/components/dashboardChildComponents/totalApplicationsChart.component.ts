import { Component, OnInit, AfterViewInit, Input,ViewContainerRef } from '@angular/core';
import { OAOadminService } from "../../services/OAOadmin.service";
import { Router } from "@angular/router";
import { ProductsInterface } from "../../interfaces/product.interface";
import {DashboardComponent} from "../dashboard.component"

declare var google: any;
declare var googleLoaded: any;

declare var jQuery: any;
declare var moment: any;


@Component({
  selector: 'dashboard_chart1',
  
  templateUrl: './totalApplicationsChart.component.html'


})

export class TotalApplicationsChartComponent implements AfterViewInit {
  public barChartOptions: any = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
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
  products: ProductsInterface[];
  productTypeCodeNamePair: Map<String, String> = new Map<String, String>();
  productTypeCodeNamePairchart2: Map<String, String> = new Map<String, String>();
  productTypeCodeNamePairchart2Dropdown: Map<String, String> = new Map<String, String>();
  TotalApplications: boolean;
  
  status: string;
  public tempDatasetLabel = [];
  public tempDataset = [];
  constructor(private loginservice: OAOadminService, private router: Router,private viewContainerRef: ViewContainerRef) {
    console.log("In total Application Constructor");
    this.viewContainerRef.clear();
    jQuery("#no-data").css("display","none");
     jQuery(".tab-content").css("display","none");
    console.log(this.viewContainerRef);
    this.status = localStorage.getItem("status");
     setTimeout(() => {
    console.log("FLag in totalappplication is ",DashboardComponent.flag);
    this.TotalApplications = DashboardComponent.flag;
   if(!(DashboardComponent.flag))
    {
     console.log("in if");
      jQuery("#no-data").css("display","block");
    }
    else
    {
        console.log("bring back tab content");
        jQuery("#no-data").css("display","none");
      jQuery(".tab-content").css("display","block");
    }
    
    }
    ,100);
    console.log("campaign id is "+ DashboardComponent.camp_id);
    
    this.barChartType = 'doughnut';
    this.barChartLegend = false;
  //  console.log("in total charts");
   // console.log(loginservice);
    this.loginservice.getProduct().subscribe(
      (subproducts: any) => {
      //  console.log("in total charts inside products");
        this.products = subproducts;
      //  console.log("Products: ", this.products);
     
        for (var i = 0; i < this.products.length; i++) {
          this.productTypeCodeNamePair.set(this.products[i].product_code, this.products[i].product_name);
          //this.productTypeCodeNamePairchart2.set(this.products[i].product_code, this.products[i].product_name);
          //this.productTypeCodeNamePairchart2Dropdown.set(this.products[i].product_code, this.products[i].product_name);
          //this.products[i].product_code_name = this.productTypeCodeNamePair.get(this.products[i].child_of);
          //this.products[i].linked_crossselling_product_name = this.crossSellingProductCodeNamePair.get(this.products[i].linked_crossselling_product);
          //console.log(this.productTypeCodeNamePair);
        }
        console.log("Products");
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
    var camp = DashboardComponent.camp_id;
    var startdate = DashboardComponent.start_value;
    var endate =DashboardComponent.end_value;
    this.loginservice.botContactedFields(false,false,false,camp,startdate,endate)
      .subscribe(
      data => {
        var remind = [];
        var count = [];
        var c=0;
     //   console.log("heloo");
     //   console.log(data);
        var promise = new Promise((resolve, reject) => {
          for (var i in data.Result) {
         // console.log("i is " + i);
          if(data.Result[i]._id == "0")
          remind.push("None");
          if(data.Result[i]._id == "1")
          remind.push("One");
          if(data.Result[i]._id == "2")
          remind.push("Two");
          if(data.Result[i]._id == "3")
          remind.push("Three");
          count.push(data.Result[i].count);
          c++;
          //count++;
        }
        if(c == data.Result.length)
        resolve("done pushhing to arrays");
        }).then((e)=>{
          console.log(e);
        this.renderremindChart(remind, count);
      });
       
      },
      error => console.error(error)
      );


    this.loginservice.NewExistingCustomer(false,false,false,camp,startdate,endate)
      .subscribe(
      data => {
        var custype =[];
        var count = [];
        var c=0;
      //  console.log("sample check")
      //  console.log(data);
     var promise = new Promise((resolve, reject) => {
       for (var i in data.Result) {
      //    console.log("i is " + i);
          if(data.Result[i]._id == 'N')
          custype.push("New");
          else
          custype.push("Existing");
          count.push(data.Result[i].count);
          //count++;
          c++
         

        }
        if(c == data.Result.length)
        resolve("done pushhing to arrays");
        }).then((e)=>{
        console.log(e);
         this.rendercustChart(custype, count);
          });

      },
      error => console.error(error)
      );

    setTimeout(()=>{
    this.loginservice.applicationByProduct(false,false,false,camp,startdate,endate)
      .subscribe(
      data => {
       console.log('sample total',data);
        console.log(data);
        var c =0;
        var promise = new Promise((resolve, reject) => {
        for (var i in data.Result) {
       //   console.log("i is " + i);
          // console.log(results.Result[i]._id);
          // console.log(this.productTypeCodeNamePair.get(results.Result[i]._id));
          data.Result[i]._id = this.productTypeCodeNamePair.get(data.Result[i]._id);

          this.tempDatasetLabel.push(data.Result[i]._id);
          this.tempDataset.push(data.Result[i].count);
          //count++;
          c++;

        }
        if(c == data.Result.length)
        resolve("done pushhing to arrays");
        }).then((e)=>{
        console.log(e+"in total");
        console.log(this.tempDatasetLabel);
        //console.log(this.tempDataset);
        this.renderProductsChart();});

      },
      error => console.error(error)
      );
      },300);

    this.loginservice.ApplicationOnDeviceType(false,false,false,camp,startdate,endate)
      .subscribe(
      data => {
        var device = [];
        var count = [];
        var c =0;
       // console.log("device type");
      //  console.log(data);
         var promise = new Promise((resolve, reject) => {
        for (var i in data.Result) {
       //   console.log("i is " + i);
          device.push(data.Result[i]._id);
          count.push(data.Result[i].count);
          //count++;
          c++;
         

        }if(c == data.Result.length)
        resolve("done pushhing to arrays");
        }).then((e)=>{
        console.log(e);
        this.renderdeviceChart(device, count);
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

          //drawVisualization(this.Friday,this.Monday,this.Saturday,this.Sunday,this.Thursday,this.Tuesday,this.Wednesday);
        }
        else {
          //   drawVisualization(this.Friday,this.Monday,this.Saturday,this.Sunday,this.Thursday,this.Tuesday,this.Wednesday);
        }

      },
      error => console.error(error)
      );



    jQuery("#closemenu").click(function (e) {
      e.preventDefault();
      jQuery("body").toggleClass("collapse-main");
    });
    jQuery('.filter-btns .btn').addClass("active");

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
  renderProductsChart() {
    console.log("in rednder char 1", this.tempDataset);
    this.barChartLabels = this.tempDatasetLabel;
    this.chart_proFlag = true;
    this.barChartData = this.tempDataset;
  }
  renderdeviceChart(d, count) {
    console.log("in device chart", d);
    this.sourChartLabels = d;
    this.chart_sourFlag = true;
    this.sourChartData = count;
    //return true;
  }
  rendercustChart(c,count){
    console.log("in existing cust chart", c);
    this.custChartLabels = c;
    this.chart_custFlag = true;
    this.custChartData = count;

  }
  renderremindChart(r,count)
  {
     console.log("in existing cust chart", r);
    this.remindChartLabels = r;
    this.chart_remindFlag = true;
    this.remindChartData = count;
  }
}
