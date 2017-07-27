import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PushToServer } from "../../../services/pushToServer.service";
import { OAOadminService } from "../../../services/OAOadmin.service";
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
declare var jQuery: any;
@Component({
    templateUrl: './switchtheme.component.html',

})
export class SwitchThemeComponent {
    public ThemeArray: any;
    public current_theme: string;
    processData: any;
    subscription: any
    Scrollsubscription: any;
    ThemeArraylength: any;
    constructor(private router: Router, private service: PushToServer, private adminservice: OAOadminService) {
        this.getCurrentTheme();
        this.service.getThemes().subscribe(
            data => {
                console.log("themes");
                console.log(data.Result);

                this.ThemeArray = data.Result;
                console.log(this.ThemeArray +".........................switch  theme................");

                if (this.ThemeArray == undefined) {
                    console.log("no record");
                    this.ThemeArraylength = 0;
                }
                if (this.ThemeArray.length != 0) {
                    this.ThemeArray.sort((a, b) => {
                        console.log(a)
                        if (a != "EmpowerDefault") {
                            return 1;
                        }
                        return -1;
                    });
                }

            }
        )
    }

    switchTheme(filename) {
        console.log(filename);
        this.service.switchThemes(filename).subscribe(
            (data) => {
                console.log(data);
            }, (error) => {
                console.log(error);
            }, () => {
                console.log("sdaas")
                this.getProcessData();

            });

    }
    ngAfterViewInit() {
        // jQuery('.carousel').carousel({
        //     interval: 1000 * 1
        // });
        jQuery("body").on("click", "#myImg", function () {
            console.log("clicked image");

            jQuery('.modal1').css("display", "block");

            jQuery("#img01").attr("src", this.src);
        });

        jQuery("body").on("click", ".close3", function () {

            jQuery('.modal1').css("display", "none");
        });
    }

    // getProcessData() {
    //     console.log("in fun")
    //     jQuery('#processData_modal').modal('show');
    //     this.subscription = Observable.interval(2000).subscribe(() => {
    //         this.service.getProcessDataF().subscribe(
    //             (data) => {

    //                 this.processData = data.status;
    //                 console.log(this.processData);
    //                 if (!this.processData) {
    //                     jQuery('#processData_modal').modal('hide');
    //                     this.reset();
    //                 }

    //             })
    //     });
    // }

    getProcessData() {
        jQuery('.carousel').carousel({
            interval: 1000 * 1.4
        });
        jQuery('#processData_modal').modal('show');
        this.subscription = Observable.interval(3500).subscribe(() => {
            jQuery('#processData_modal').modal('hide');
            this.reset();
        })
    }

    reset() {
        this.getCurrentTheme();
        this.service.resetData().subscribe(
            (data) => {
                this.processData = data.result;
            })
        this.subscription.unsubscribe();

    }
    getCurrentTheme() {
        this.adminservice.GetPropertyDetails('GENERIC_PROP', 'CURRENT_UXTHEME')
            .subscribe(
            data => {
                this.current_theme = data.result[0].property_value;
                console.log("current theme", this.current_theme);
            }
            );
    }
}