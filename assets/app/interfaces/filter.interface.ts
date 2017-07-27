export class FilterInterface{
    public application_status:String;
    public search_key:String;
    public product_type:String;
    public date_rage:String;

    constructor(application_status:String,search_key:String,product_type:String,date_rage:String){
        this.application_status=application_status;
        this.search_key=search_key;
        this.product_type=product_type;
        this.date_rage=date_rage;
    }
}