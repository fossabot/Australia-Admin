import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { OAOadminService } from "../../services/OAOadmin.service";
import { Router } from "@angular/router";

import { ProductsInterface } from "../../interfaces/product.interface";

declare var google: any;

@Component({
    selector: 'dashboard_chart5',
    templateUrl: './crossSellProduct.component.html'

})
export class CrossSellProductComponent {

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
    public product_drop;
    public barChartLabels: string[];
    public barChart2Labels: string[];
    public barChartType: string;
    public barChartLegend: boolean;

    public barChartData: any[];

    public chartColors: any[];

    public barChart2Data: any[];

    public chart2Colors: any[];

    public tempDatasetLabel = [];
    public tempDataset = [];
    public tempDatasetColor = [];
    public DropDownData = [];

    public tempDatasetLabelChart2 = [];
    public tempDatasetChart2 = [];

    public chart1Flag: boolean;
    public chart2Flag: boolean;

    products: ProductsInterface[];

    productTypeCodeNamePair: Map<String, String> = new Map<String, String>();
    productTypeCodeNamePairchart2: Map<String, String> = new Map<String, String>();
    productTypeCodeNamePairchart2Dropdown: Map<String, String> = new Map<String, String>();

    constructor(private loginservice: OAOadminService, private router: Router) {

        this.barChartType = 'bar';
        this.barChartLegend = false;
        this.chart1Flag = false;
        this.chart2Flag = false;


        //const crosspromise = new Promise((resolve, reject) => {
            this.loginservice.getProduct().subscribe(
                (subproducts: any) => {
                    this.products = subproducts;
                    console.log("Products: ", this.products);

                    for (var i = 0; i < this.products.length; i++) {
                        this.productTypeCodeNamePair.set(this.products[i].product_code, this.products[i].product_name);
                        this.productTypeCodeNamePairchart2.set(this.products[i].product_code, this.products[i].product_name);
                        this.productTypeCodeNamePairchart2Dropdown.set(this.products[i].product_code, this.products[i].product_name);
                        //this.products[i].product_code_name = this.productTypeCodeNamePair.get(this.products[i].child_of);
                        //this.products[i].linked_crossselling_product_name = this.crossSellingProductCodeNamePair.get(this.products[i].linked_crossselling_product);
                        console.log(this.productTypeCodeNamePair);
                    }
                }
            );
       //    // resolve();
       // });


        const promise = new Promise((resolve, reject) => {
            this.loginservice.CrossProductsCount()
                .subscribe(
                results => {
                    var count=0;
                    console.log(results);
                    console.log("length is ",results.Result.length);
                    for (var i in results.Result) {
                        console.log("i is "+ i);
                        console.log(results.Result[i]._id);
                        console.log(this.productTypeCodeNamePair.get(results.Result[i]._id));
                        results.Result[i]._id = this.productTypeCodeNamePair.get(results.Result[i]._id);

                        this.tempDatasetLabel.push(results.Result[i]._id);
                        this.tempDataset.push(results.Result[i].count);
                        count++;

                    }
                    console.log(this.tempDatasetLabel);
                    console.log(this.tempDataset);
                    console.log("count is "+count);
                   // if(count == results.Result.length)
                    resolve("render chart1");

                },
                (err) => console.error(err)

                )


        }).then((e) => {
            console.log(e);
            this.renderChart1();

        });



        this.loginservice.getAllCrossSellingProducts()
            .subscribe(data => {
                // console.log(data);
                for (var i in data) {
                    // data[i].product_code = this.productTypeCodeNamePairchart2Dropdown.get(data[i].product_code);
                    this.DropDownData.push(data[i]);
                }
            },
            (err) => {
                console.log("error");
            }, () => {
                var count=0;
                console.log("Success");
                console.log(this.DropDownData);
                console.log(this.DropDownData[0].product_code);
                this.product_drop = this.DropDownData[0].product_code;
                const promise2 = new Promise((resolve, reject) => {
                    console.log("product code ::::");
                    console.log(this.products[0].product_code.toString());
                    this.loginservice.CrossProductTypeCount(this.DropDownData[0].product_code)
                        .subscribe(data => {
                            console.log(data);
                            for (var i in data) {
                                data[i]._id = this.productTypeCodeNamePairchart2.get(data[i]._id);
                                this.tempDatasetLabelChart2.push(data[i]._id);
                                this.tempDatasetChart2.push(data[i].count);
                                count++;
                            }
                            if(count == data.length)
                            resolve("rednder chart 2");

                        },
                        (err) => {

                        }
                        )
                }).then((e)=>{
                    console.log(e);
                    this.renderChart2();
                })
            })



    }
  

    onChange(EventData: any) {
        this.chart2Flag = false;
        // console.log(EventData.target.value);

        this.tempDatasetLabelChart2 = [];
        this.tempDatasetChart2 = [];
        // this.barChart2Labels=[];

        this.loginservice.CrossProductTypeCount(EventData.target.value)
            .subscribe(data => {
                console.log(data);
                for (var i in data) {
                    data[i]._id = this.productTypeCodeNamePairchart2.get(data[i]._id);
                    this.tempDatasetLabelChart2.push(data[i]._id);
                    this.tempDatasetChart2.push(data[i].count);
                }

            },
            (err) => {

            }, () => {
                console.log("chart two got executed");
                console.log(this.tempDatasetLabelChart2);
                this.renderChart2();
            })
    }

    renderChart1() {
        console.log("in rednder char 1",this.tempDataset);
        this.barChartLabels = this.tempDatasetLabel;

        this.chart1Flag = true;

        this.barChartData = [
            { data: this.tempDataset, label: 'Count' }
        ];

        this.chartColors = [
            {
                backgroundColor: ["#15A6FD", "#4DB505", "#fff", "#B9E8E0", "#6FC8CE", "#FAFFF2", "#FF7360", "#6FC8CE", "#FAFFF2"]
            }];

    }

    renderChart2() {
        console.log("inside chart function 2");
        console.log(this.tempDatasetLabelChart2);
        this.barChart2Labels = [];
        this.barChart2Labels = this.tempDatasetLabelChart2;

        this.chart2Flag = true;

        this.barChart2Data = [
            { data: this.tempDatasetChart2, label: 'Count' }
        ];

        this.chart2Colors = [
            {
                backgroundColor: ["#15A6FD", "#4DB505", "#7E00D0", "#FFFCC4", "#B9E8E0", "#6FC8CE", "#FAFFF2", "#FF7360", "#6FC8CE", "#FAFFF2"]
            }];

    }


}

