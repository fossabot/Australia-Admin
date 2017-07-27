import {Component} from "@angular/core";
import { Router } from "@angular/router";
import { OAOadminService} from "../../services/OAOadmin.service";
@Component({
    template:'dddd'

})
export class LogoutComponent 
{
     constructor(private loginservice:OAOadminService,private router:Router){
     }

     logout()
     {
      this.loginservice.logout();
        this.router.navigate(['/login']);   
     }
     
}