export class AppConstants {
    /*
        public  ACTIVE = "SAV";
        public  INCOMPLETE = "INC"; //INCMP
        public static COMPLETED = "CMP";
        public static VERIFIED = "VER";
        public static CANCELLED = "CAN";
        public static REJECTED = "REJ";
        public static ONBOARDED = "ONB"; //ONBOARD
       */
    baseURL:string = "http://localhost:3001";
    get ACTIVE() {
        return "SAV";
    }
    get INCOMPLETE() {
        return "INC";
    }
    get COMPLETED() {
        return "CMP";
    }
    get VERIFIED() {
        return "VER";
    }
    get CANCELLED() {
        return "CAN";
    }
    get REJECTED() {
        return "REJ";
    }
    get ONBOARDED() {
        return "ONB";
    }
    get CROSSSELL() {
        return "CRS";
    }
    get UPSELL() {
        return "UPS";
    }
    get URL(){
        return this.baseURL
    }

}