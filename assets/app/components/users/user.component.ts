import {Component,AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';

declare var jQuery:any;
declare var moment: any;
@Component({
    templateUrl:'./user.component.html'
})

export class UserComponent implements AfterViewInit
{
   menu:string;
status:string;
    constructor(private router:Router)
    {
    console.log("menu option is"+ localStorage.getItem("menu"));
      this.menu = localStorage.getItem("menu");
  this.status=localStorage.getItem("status");
      
    }

     ngAfterViewInit() {
        
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
   
}
