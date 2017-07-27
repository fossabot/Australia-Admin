export class AddFieldInterface {
    constructor(
        public label: string,
        public placeholder:string,
        public status:string,
        public section:string,
        public section_name:string,
        public freetext:string,
        public product_type:string
    ){
        this.label=label;
        this.placeholder=placeholder;
        this.status=status;
        this.section=section;
        this.section_name=section_name;
        this.freetext=freetext;
        this.product_type=product_type;

    }
}