var express   = require('express');
var  bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var http      = require('http');
var jwt    = require('jsonwebtoken');
var restful   = require('sequelize-restful');
var router = express.Router();
app       = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
    next();
});

// database Connection
 sequelize = new Sequelize('d1stbd9tkqir1t', 'xctocsynayutgf', '48bc9c154a309a4572b68e0f6f8214e7a29c2655954902547197686ab6071af3', {
      dialect: "postgres", // or 'sqlite', 'postgres', 'mariadb'
       host: 'ec2-54-221-254-72.compute-1.amazonaws.com',
      port:    5432, // or 5432 (for postgres)
	  logging:false,
      dialectOptions: {
        ssl: true
    },
        define: {
        timestamps: false
    },
    freezeTableName: true
    });

// table schemas
var User = sequelize.define('admin_login_sample', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
}, {
    tableName: 'admin_login_sample', 
    timestamps: false    
});


var loan = sequelize.define('loan', {
    loan_id:{
		type: Sequelize.INTEGER
	},
    loan_type: Sequelize.STRING
}, {
    tableName: 'loan', 
    timestamps: false    
});

var ProductRequest = sequelize.define('ProductRequest', {
    prod_id:{
		type: Sequelize.INTEGER
	},
    prod_type: Sequelize.STRING,
    created_date: {
		type: Sequelize.DATE, 
		defaultValue: Sequelize.NOW
	},
    }, 
    {
    tableName: 'ProductRequest',   
});


var SourceOfApplication = sequelize.define('SourceOfApplication', {
    source_id:{
		type: Sequelize.INTEGER
	},
    source_type: Sequelize.STRING
    }, 
    {
    tableName: 'SourceOfApplication',   
});

var ProspectsData = sequelize.define('ProspectsData', {
    pros_id:{
		type: Sequelize.INTEGER
	},
    pros_type: Sequelize.STRING
    }, 
    {
    tableName: 'ProspectsData',   
});

var customerDetails = sequelize.define('cust_details',{
	customer_id:{
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: Sequelize.STRING(80),
	email: Sequelize.STRING(30),
	dob : Sequelize.DATEONLY,
	address : Sequelize.STRING,
	mobile_no : Sequelize.INTEGER,
	id_type :Sequelize.STRING(30),
	id_number :Sequelize.STRING(30),
	id_state: Sequelize.STRING(30),
	username: Sequelize.STRING(30),
	password : Sequelize.STRING(30),
	core_customer_id :Sequelize.STRING(30),
	core_account_no_list :Sequelize.JSON,
	create_date_with_time: {
		type: Sequelize.DATE, 
		defaultValue: Sequelize.NOW
	},
	modify_date_with_time : {
		type: Sequelize.DATE, 
		defaultValue: Sequelize.NOW
	},
	created_by : Sequelize.STRING(80),
	modified_by :Sequelize.STRING(80),
	delete_flag : {
		type:Sequelize.STRING(3),
		defaultValue :'n'
	}
},{
  timestamps: false    
});

sequelize.sync();

// router.use(function(req,res,next){
//     res.json({msg:"msg test"});
// });

router.route("/AnalyticsData")
    .get(function(req,res,next){
        loan.findAll({
            group: ['loan_type'],
            attributes: ['loan_type', [sequelize.fn('COUNT', 'loan_type'), 'TagCount']],
            })
        .then(function (tags) {
             res.json({result:tags})
        });
    })

    router.route("/AnalysDataOfProductTypeRequest")
    .get(function(req,res,next){
        ProductRequest.findAll({
            group: ['prod_type'],
             order: 'prod_type ASC',
            attributes: ['prod_type', [sequelize.fn('COUNT', 'prod_type'), 'TagCount']],
            })
        .then(function (tags) {
             res.json({result:tags})
        });
    })

    router.route("/AnalysDataOfSourceOfApplication")
    .get(function(req,res,next){
        SourceOfApplication.findAll({
            group: ['source_type'],
             order: 'source_type ASC',
            attributes: ['source_type', [sequelize.fn('COUNT', 'source_type'), 'TagCount']],
            })
        .then(function (tags) {
             res.json({result:tags})
        });
    })

      router.route("/ProspectsData")
    .get(function(req,res,next){
        ProspectsData.findAll({
            group: ['pros_type'],
             order: 'pros_type ASC',
            attributes: ['pros_type', [sequelize.fn('COUNT', 'pros_type'), 'TagCount']],
            })
        .then(function (tags) {
             res.json({result:tags})
        });
    })

      router.route("/getDayPerApplication")
    .get(function(req,res,next){
        ProductRequest.findAll({
            // group: ['pros_type'],
            //  order: 'pros_type ASC',
            attributes: [
                [sequelize.fn('to_char', sequelize.col('created_date'),'day'), 'dayOfApplication' ],
                [sequelize.fn('count','dayOfApplication'  ),  'count' ]
                ],
            group: ['dayOfApplication']
            })
        .then(function (tags) {
             res.json({result:tags})
        });
    })

     router.route("/getPerDayApplication")
    .get(function(req,res,next){
        ProductRequest.findAll({
            // group: ['pros_type'],
            //  order: 'pros_type ASC',
            attributes: [
                [sequelize.fn('day from timestamp', sequelize.col('created_date'),'day'), 'dayOfApplication' ],
                [sequelize.fn('count','dayOfApplication'  ),  'count' ]
                ],
            group: ['dayOfApplication']
            })
        .then(function (tags) {
             res.json({result:tags})
        });
    })

      router.route("/getCustDetails")
    .get(function(req,res,next){
        customerDetails.findAll()
        .then(function (tags) {
             res.json({result:tags})
        });
    })

       router.route("/getSingleCustomer/:param_id")
    .get(function(req,res,next){
       var id=req.params.param_id;
			customerDetails.findById(id).then(function(customerDetails){
				
                if(customerDetails)
			{
				res.json({result:customerDetails});
			}
			else
			{
				res.json({result:'Record not Found'});
			}
			})
    })

router.route('/AddEveryDayAccounts')
    .post(function(req,res,next){
		var prod_id=req.body.prod_id;
		var prod_type=req.body.prod_type;
		
		    ProductRequest.create({
			prod_id:prod_id,
			prod_type:prod_type,
		}).then(function(ProductRequest){
          res.json({ message: 'Record Added SuccessFully'});
        })
	});

module.exports = router;