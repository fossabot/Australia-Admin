export class ProductsTypeInterface {
    constructor(
        public product_type_code?: String,
        public product_type_name?: String,
        public country_code?: String,
        public category?: String
    ) {
        this.product_type_code = product_type_code;
        this.product_type_name = product_type_name;
        this.country_code = country_code;
        this.category = category;
    }
}