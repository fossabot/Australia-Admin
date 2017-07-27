export class CrossSellingProductsInterface {
    constructor(
        public cross_selling_product_code: String,
        public cross_selling_name: String,
        public display_text: String
    ) {
        this.cross_selling_product_code = cross_selling_product_code;
        this.cross_selling_name = cross_selling_name;
        this.display_text = display_text;
    }
}