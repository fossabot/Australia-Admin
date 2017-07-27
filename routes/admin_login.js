var express   = require('express');
var  bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var http      = require('http');
var jwt    = require('jsonwebtoken');
var restful   = require('sequelize-restful');
var router = express.Router();
app       = express();

app.set('superSecret', 'samplekey');

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

sequelize.sync();

//login request for login

router.route('/loginProcess')
	.post(function(req, res) {
        var username=req.body.username;
        var password=req.body.password;

      User.findOne({where :{username:username,password:password}}).then(function(User){
        
       if(User)
       {
        //   res.json({ message: 'Record Already Exist' });
         var token = jwt.sign(User.dataValues.username, app.get('superSecret'));
        res.json({
            status:"Authenticated", 
            username: User.dataValues.username,
            token:token
         });
       }
       else{
         res.json({status:"Invalid"});
       }
   
    })
})
.get(function(req,res,next){
    res.json({result:"sample"});
})



module.exports = router;