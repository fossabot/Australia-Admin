import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { ApplicationComponent } from "../components/applicationDetailsComponents/application/application.component"

declare var jQuery:any;

@Directive({
    selector: '[assignValidate][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => AssignedToValidator), multi: true }
    ]
})

export class AssignedToValidator implements Validator {
  
    constructor( @Attribute('assignValidate') public assignValidate: string,
        @Attribute('reverse') public reverse: string) {
        var s = "#valid-";
     var clas = s.concat(ApplicationComponent.idno);
   jQuery(clas).addClass("disable"); 
    }

    validate(c: AbstractControl): { [key: string]: any } {
        // self value
        
    let v = jQuery.trim(c.value);
    let isVisible = true;
    //console.log("input is " + v);
     //console.log("halu");
    //console.log(ApplicationComponent.passadmins);
    var x;
    if(!ApplicationComponent.assigned_table){
        console.log("below table if")
         x = "#err-";
    }
     
    else{
        console.log("below table else")
        x="#err_assigned-";
    }
   
    var err = x.concat(ApplicationComponent.idno);
   var count =0;
   var s = "#valid-";
     var clas = s.concat(ApplicationComponent.idno);
  // jQuery(clas).addClass("disable"); 
   ApplicationComponent.flag = 0;
  

    var promise = new Promise(function(resolve,reject){
     jQuery.each(ApplicationComponent.passadmins,function(){
           // console.log(this.username);
            //console.log(count);
            count++;
            if(v === "Unassigned" || v === this.username )
            {   
               // console.log("mila" + v);
              ApplicationComponent.flag = 1;
               resolve("found");
               //console.log("befoir false");
               
               return false;
            }
            });
            if(ApplicationComponent.flag == 0){
                    
                    reject("not found");
                }   
            }).then(function(e){
                
                //console.log(e);
                jQuery(err).css("display","none");
                return {assignValidate:false};

            }).catch(function(e){
                //console.log(e);
                jQuery(err).css("display","block");
                return {assignValidate : true};
            });
   

    return promise;
}
   
}