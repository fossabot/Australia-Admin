import { Component,OnInit,AfterViewInit,ViewContainerRef,ComponentFactoryResolver } from '@angular/core';
import { Router,ActivatedRoute } from "@angular/router";

import { Daterangepicker } from 'ng2-daterangepicker';
import { DaterangepickerConfig } from 'ng2-daterangepicker';

import { OAOadminService} from "../services/OAOadmin.service";

import {TotalApplicationsChartComponent} from "../components/dashboardChildComponents/totalApplicationsChart.component";
import {CompletedApplicationsChartComponent} from "../components/dashboardChildComponents/completedApplicationsChart.component";
declare var google:any;
declare var googleLoaded:any;

declare var jQuery:any;
declare var moment: any;

@Component({
    // selector:'dashboard',
    templateUrl:'./dashboard.component.html',

})

export class DashboardComponent implements AfterViewInit
{
    status:string;
    TotalApplications:Number=0;
    daterangevalue:any
    Complete:Number = 0;
    InComplete:Number= 0;
    Active:Number = 0;
    menu:string ;
    campaign_id:any;
    static flag:boolean = true;
    static flag_cmp:boolean =false;
    static flag_incmp:boolean =false;
    static flag_active:boolean =false;
    static camp_id:any = null;
    static start_value = null;
    static end_value = null;
    service : OAOadminService;
    route:Router;
    view_ref: ViewContainerRef; 

    DateRangeForFilerGraph:any;

     public daterange: any = {};
 
    // see original project for full list of options 
    // can also be setup using the config service to apply to multiple pickers 
    public options: any = {
        locale: { format: 'YYYY-MM-DD' },
        alwaysShowCalendars: false,
    };
 
    public selectedDate(value: any) {
    //Start Date 
    var StartTimeStamp=new Date(value.start).getTime();

    var StartToDate=new Date(StartTimeStamp).getDate();
    var StartToMonth=new Date(StartTimeStamp).getMonth()+1;
    var StartToYear=new Date(StartTimeStamp).getFullYear();

    var Startoriginal_date=StartToYear+'-'+StartToMonth+'-'+StartToDate;

     console.log("startdate",Startoriginal_date);

    //End Date

     var EndTimeStamp=new Date(value.end).getTime();

    var EndToDate=new Date(EndTimeStamp).getDate();
    var EndToMonth=new Date(EndTimeStamp).getMonth()+1;
    var EndtToYear=new Date(EndTimeStamp).getFullYear();

    var Endoriginal_date=EndtToYear+'-'+EndToMonth+'-'+EndToDate;
     
      console.log("enddate",Endoriginal_date);

        this.daterange.start = value.start;
        this.daterange.end = value.end;
        this.daterange.label = value.label;

        this.DateRangeForFilerGraph={
          start:Startoriginal_date,
          end:Endoriginal_date
        }
        console.log("sads",this.DateRangeForFilerGraph);

    }

    constructor(private loginservice:OAOadminService,private router:Router,private daterangepickerOptions: DaterangepickerConfig,private componentFactoryResolver:ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef)
    {
      console.log("menu option is"+ localStorage.getItem("menu"));
      //jQuery("#no-data").css("display","none");
      this.service = loginservice;
      this.route = router;
      this.view_ref=viewContainerRef;
      this.menu = localStorage.getItem("menu");
      console.log("moment is ",moment());
      console.log(moment().format("YYYY-MM-DD"));
      DashboardComponent.start_value=moment().format("YYYY-MM-DD");
      DashboardComponent.end_value=moment().format("YYYY-MM-DD");
      this.DateRangeForFilerGraph={
          start:DashboardComponent.start_value,
          end:DashboardComponent.end_value
        }
      
       this.daterangepickerOptions.settings = {
            locale: { format: 'YYYY-MM-DD' },
            alwaysShowCalendars: false,
            ranges: {
               'Last Month': [moment().subtract(1, 'month'), moment()],
               'Last 3 Months': [moment().subtract(4, 'month'), moment()],
               'Last 6 Months': [moment().subtract(6, 'month'), moment()],
               'Last 12 Months': [moment().subtract(12, 'month'), moment()],
            }
        };


        this.status=localStorage.getItem("status");
     

          this.loginservice.getTotalCount(null,DashboardComponent.start_value,DashboardComponent.end_value)
                .subscribe(
                  data => {
                    this.TotalApplications=data.Result;
                    if(this.TotalApplications == 0){
                    //jQuery("#no-data").css("display","block");
                    DashboardComponent.flag = false;
                    }
                    else
                     DashboardComponent.flag = true;
                  },
                  error => console.error(error)
                ); 

                  this.loginservice.CompleteANDIncompleteApp(null,DashboardComponent.start_value,DashboardComponent.end_value)
                .subscribe(
                  data => {
                      //console.log("complete count");
                     // console.log(data);
                      this.Active=0;
                      this.Complete=0;
                      this.InComplete=0;
                       for (var i in data.Result) {
                        console.log("i is " + i + data.Result[i]._id);
                        if(data.Result[i]._id == "CMP")
                        {
                            this.Complete = data.Result[i].count;
                            DashboardComponent.flag_cmp = true;
                        }
                        else if(data.Result[i]._id == "INCMP")
                        {
                            this.InComplete = data.Result[i].count;
                            DashboardComponent.flag_incmp = true;
                        }
                        else if(data.Result[i]._id == "SAV")
                        {
                            this.Active = data.Result[i].count;
                            DashboardComponent.flag_active = true;
                        }
                        //custype.push(data.Result[i]._id);
                        //count.push(data.Result[i].count);
                        //count++;
                        //this.rendercustChart(custype, count);

                        }
                   
                  
                  },
                  error => console.error(error)
                );
    }

    public dateInputs: any = [
        {
            start: moment().subtract(12, 'month'),
            end: moment().subtract(6, 'month')
        },
        {
            start: moment().subtract(9, 'month'),
            end: moment().subtract(6, 'month')
        },
        {
            start: moment().subtract(4, 'month'),
            end: moment()
        },
        {
            start: moment(),
            end: moment().add(5, 'month'),
        }
    ];

    public mainInput = {
        start: moment().subtract(12, 'month'),
        end: moment().subtract(6, 'month')
    }
    
    public singlePicker = {
      singleDatePicker: true,
      showDropdowns: true,
      "opens": "left"
    }
    
    public singleDate: any;

    public eventLog = '';

    //  private selectedDate(value: any, dateInput: any) {
    //     dateInput.start = value.start;
    //     dateInput.end = value.end;
    // }
    
    private singleSelect(value: any) {
        this.singleDate = value.start;
    }

    private applyDate(value: any, dateInput: any) {
        dateInput.start = value.start;
        dateInput.end = value.end;
    }

    public calendarEventsHandler(e:any) {
        console.log(e);
        this.eventLog += '\nEvent Fired: ' + e.event.type;
    }

    refresh(){
      location.reload();
    }

     ngAfterViewInit() {
      
        //   google.charts.load('current', {'packages':['corechart']});
jQuery("#menu-toggle").click(function(e) {
      e.preventDefault();
          jQuery("body").toggleClass("collapse-main");
      });
			jQuery("#sidebar-close,.overlay").click(function() {
	     jQuery("body").removeClass("collapse-main");
	  });

       jQuery("#closeOnclick,.overlay").click(function() {
	     jQuery("body").removeClass("collapse-main");
	  });

       jQuery("#closemenu").click(function(e) {
                e.preventDefault();
                jQuery("body").toggleClass("collapse-main");
            });
 

		jQuery( "#filter-List" ).click(function() {
		    jQuery( "#filter-List-elms" ).toggleClass("collapse-main");
		});

    
   
jQuery(function () {
  jQuery('[data-toggle="tooltip"]').tooltip()
})


  }
   logout()
     {
      this.loginservice.logout();
        this.router.navigate(['/login']);   
     }
     filterbyCampaignId()
     {  console.log("n filter campign graph");
     DashboardComponent.camp_id = null;
       // console.log("date is");
       // console.log(this.DateRangeForFilerGraph);
        var start = new Date(this.DateRangeForFilerGraph.start);
         DashboardComponent.start_value = moment(start).format("YYYY-MM-DD");
        //console.log("ISOdate start"+ DashboardComponent.start_value );
        var end = new Date(this.DateRangeForFilerGraph.end);
        DashboardComponent.end_value = moment(end).format("YYYY-MM-DD");
        //console.log("ISODATE end"+ DashboardComponent.end_value);

        if(this.campaign_id!= null && this.campaign_id !="" && this.campaign_id != undefined )
        DashboardComponent.camp_id= this.campaign_id;
        // console.log("campign id from input is"+DashboardComponent.camp_id);
        // console.log("jquery text us"+jQuery('#total li:nth-child(1) a').text());
                //jQuery('#total li:nth-child(1) a').click();
                //jQuery('#total li:nth-child(1) a').trigger("click")
        //new CompletedApplicationsChartComponent(this.service,this.route,this.view_ref).clearView();   
                //this.viewContainerRef.clear();
         
        /* const factory = this.componentFactoryResolver.resolveComponentFactory(TotalApplicationsChartComponent);
                const ref = this.viewContainerRef.createComponent(factory);*/
                
                
        //ref.changeDetectorRef.detectChanges();                      
                
                 //this.router.navigate(['/dashboard/total']);
              
         this.loginservice.getTotalCount(DashboardComponent.camp_id,DashboardComponent.start_value,DashboardComponent.end_value)
                .subscribe(
                  data => {
                    this.TotalApplications=data.Result;
                     if(this.TotalApplications == 0){
                         console.log("setting flag to false");
                    //jQuery("#no-data").css("display","block");
                    DashboardComponent.flag = false;
                    
                    }
                    else
                     DashboardComponent.flag = true;
                       
                  },
                  error => console.error(error)
                ); 

                  this.loginservice.CompleteANDIncompleteApp(DashboardComponent.camp_id,DashboardComponent.start_value,DashboardComponent.end_value)
                .subscribe(
                  data => {
                      //console.log("complete count");
                      //console.log(data);
                      this.Active=0;
                      this.Complete=0;
                      this.InComplete=0;
                      DashboardComponent.flag_cmp = false;
                      DashboardComponent.flag_incmp = false;
                      DashboardComponent.flag_active = false;
                       for (var i in data.Result) {
                        //console.log("i is " + i + data.Result[i]._id);
                        if(data.Result[i]._id == "CMP")
                        {
                            this.Complete = data.Result[i].count;
                            DashboardComponent.flag_cmp = true;
                        }
                        else if(data.Result[i]._id == "INCMP")
                        {
                            this.InComplete = data.Result[i].count;
                            DashboardComponent.flag_incmp = true;
                        }
                        else if(data.Result[i]._id == "SAV")
                        {
                            this.Active = data.Result[i].count;
                            DashboardComponent.flag_active = true;
                        }
                        
                        }
                        $('#total1')[0].click();
                        jQuery('#total li').removeClass("active");
                        setTimeout(() => {       
                        $('#total')[0].click();
                        // jQuery('#total li:nth-child(1)').addClass("active")
                        },100);
       
               
               // $('ul.nav-pills').children().eq($('li.active').index()).removeClass("active");
                
             //   setTimeout(() => {
                //    this.router.navigate(['/dashboard/totalChart']);
               //     jQuery('#total li').removeClass("active");
               //     jQuery('#total li:nth-child(1)').addClass("active")},300);
                //$('#gallery li:nth-child(2) a').click();
                 },
                error => console.error(error)
                );
               
                //jQuery("#total a").trigger("click");
     }
      
     
}
