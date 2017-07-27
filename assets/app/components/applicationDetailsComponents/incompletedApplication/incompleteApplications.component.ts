import { Component,OnInit,AfterViewInit } from '@angular/core';

declare var jQuery:any;
declare var moment: any;

@Component({
    templateUrl:'./incompleteApplications.component.html'
})

export class IncompleteApplicationsComponent implements AfterViewInit
{
   ngAfterViewInit() {
     
jQuery("#menu-toggle").click(function(e) {
      e.preventDefault();
          jQuery("body").toggleClass("collapse-main");
      });
			jQuery("#sidebar-close,.overlay").click(function() {
	     jQuery("body").removeClass("collapse-main");
	  });
   //Date range as a button
    // jQuery('#daterange-btn').daterangepicker(
    //     {
    //       ranges: {
    //         'Today': [moment(), moment()],
    //         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    //         'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    //         'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    //         'This Month': [moment().startOf('month'), moment().endOf('month')],
    //         'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    //       },
    //       startDate: moment().subtract(29, 'days'),
    //       endDate: moment()
    //     },
    //     function (start, end) {
    //       jQuery('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    //     }
    // );

		jQuery( "#filter-List" ).click(function() {
		    jQuery( "#filter-List-elms" ).toggle();
		});
   
jQuery(function () {
  jQuery('[data-toggle="tooltip"]').tooltip()
})

}
}