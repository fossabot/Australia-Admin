const crypto = require('crypto');
var random = require("random-js")();
var jade = require('jade');
var nodemailer = require('nodemailer');
var OAOProductDetail = require('../models/OAOProductSchema');
var OAOProductTypeDetail = require('../models/OAOProductTypeSchema');
var config_urls = require("../configFiles/DBconfigfile");
var oaoApplicant = require('../models/OAOApplicantSchema');
var OAOPropertyDetail = require('../models/OAOPropertyDetailSchema');
var cmis = require('cmis');
var request = require('request');
var fs = require("fs");
var mkdirp = require("mkdirp");
var session = cmis.createSession(config_urls.url.cmis_alfresco_url);
session.setCredentials(config_urls.url.alfresco_username, config_urls.url.alfresco_password)
module.exports = {
        getProductType: function (callback) {
        OAOProductTypeDetail.find({category:'product',country_code:config_urls.country}, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },
    
       SendMail: function(email, data, callback) {
        var template;
        var mailOptions;

        template = process.cwd() + '/public/mailtemplate/marketPlace.jade';

        fs.readFile(template, 'utf-8', function(err, file) {
            if (err) {
                console.log('Error while rendering jade template', template);
            } else {
                var compiledTmpl = jade.compile(file, { filename: template });
                var context = { data: data };
                htmlToSend = compiledTmpl(context);

                /**
                 * node mailer transporter
                 */
                var transporter = nodemailer.createTransport({
                    host: config_urls.url.host,
                    port: config_urls.url.port,
                    secure: true, // use SSL 
                    auth: {
                        user: config_urls.url.gmailID,
                        pass: config_urls.url.gmailPassword
                    }
                });

                // if (emailTemplateId == 'SAVE_SUBMISSION') {
                mailOptions = {
                    from: config_urls.url.gmailID,
                    to: email,
                    subject: 'Application Saved Succesfully',
                    html: htmlToSend
                }

                /**
                 *  send mail with defined transport object 
                 */
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log('Error while sending mail', error);
                        return callback(Result = "false");
                    }

                    console.log('Message sent: ' + info.response);
                    return callback(Result = "true");
                });
            }
        });
    },
		encryption:function(msg,callback){
		var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
		var crypted = cipher.update(msg,'utf8','hex')
		crypted += cipher.final('hex');
		return callback(crypted);
		
	},
	decryption:function(crypted_msg,callback){
		var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
		var dec = decipher.update(crypted_msg,'hex','utf8')
		dec += decipher.final('utf8');
		return callback(dec);
		
	},
     getProductTypeAll: function (callback) {
        OAOProductTypeDetail.find({country_code:config_urls.country}, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },

    // CROSS CELL PRODUCT API's

    CrossProductsCount: function(callback) {
        OAOProductDetail.find({ del_flg: false }, function(err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },
    getAllCrossSellingProducts: function(callback) {
        var product_type_code = 'CRS';
        OAOProductDetail.find({ child_of: product_type_code, del_flg: false }, function(err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },

    getProduct: function(callback) {
        OAOProductDetail.find({child_of:{$nin:['CRS', 'UPS']} ,del_flg: false }, function(err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },
    getProductAll: function(callback) {
        OAOProductDetail.find({del_flg: false }, function(err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },
    getSubProduct: function (callback) {
        OAOProductDetail.find({del_flg:false}, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },
    getAllCrossSellingProducts:function(callback){
        var product_type_code='CRS';
        OAOProductDetail.find({child_of:product_type_code,del_flg:false},function(err,result){
            if(err){
                return callback(err);
            }
            return callback(result);
        })
    },
        getAllUpSellingProducts:function(callback){
        var product_type_code='UPS';
        OAOProductDetail.find({child_of:product_type_code,del_flg:false},function(err,result){
            if(err){
                return callback(err);
            }
            return callback(result);
        })
    },
    updateProductFeatures:function(code,data,callback)
    {
        console.log("code is ",code,data);
        OAOProductDetail.findOneAndUpdate({product_code:code},{$set:data},function(err,result){
            if(err)
            {
                console.log("error in updating features",err);
                return callback(err);
            }
            else{
                console.log("result in features",result)
                callback(result);
            }
        })

    },
    addProdTypeData: function (data, callback) {
        this.getProductTypeContent(data.product_type_code, function (result) {
            if (!result || result == '') {
                console.log(data)
                data.save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            } else {
                result[0].product_type_code = data.product_type_code,
                    result[0].product_type_name = data.product_type_name,
                    result[0].country_code=data.country_code
                result[0].save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            }
        })

    },
    getProductSequence:function(data)
    {   return new Promise((resolve,reject)=>{ 
       
        query = {child_of:data};
        
         OAOProductDetail.count(query,function(err,result){
             if(err)
             console.log("error in getting count",err);
             else if(result > 0)
            {
            console.log("Query to get Sequence NUmber",query);
            OAOProductDetail.find(query,{sequence:1}).sort({cre_time:-1}).limit(1).exec(function(err,result){
                if(err){
                console.log(err);
                resolve(-1);
                }
                else if(result== null)
                {
                    console.log("No sequence found");
                    resolve(-1)
                }
                else{
                    console.log(result);
                    console.log("sequence number is",result[0].sequence);
                    resolve(result[0].sequence);
                }
            });
            }
            else
            {
                resolve('000')
            }
        })
    
     })
    },
    addCrossOrUpsell:function(data,data1,callback)
    {
    OAOProductDetail.insertMany([data,data1],function(err,result){
        if(err){
            console.log("error inserting both cross and upsell",err);
            return callback(err);
        }
        else{
            return callback(result); 
        }
    })
    },
    addData: function (data, callback) {
        
        this.getProductContent(data.product_code, function (result) {
            if (!result || result == '') {
                console.log(data)
                data.save(function (err, result) {
                    if (err) {
                        console.log(err)
                        return callback(err);
                    }
                    return callback(result);
                });
            } else {
                result[0].product_code = data.product_code,
                    result[0].product_name = data.product_name,
                    result[0].core_identifier = data.core_identifier,
                    result[0].child_of = data.child_of,
                    result[0].linked_crossselling_product=data.linked_crossselling_product,
                    result[0].display_text=data.display_text,
                    result[0].display_text_upsell=data.display_text_upsell,
                    result[0].del_flg=data.del_flg,
                    result[0].linked_upsell_product=data.linked_upsell_product,
                    result[0].verification_mode=data.verification_mode,
                    result[0].save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            }
        })

    },
    addCSData: function (data, callback) {
        this.getCrossSellingProductContent(data.cross_selling_product_code, function (result) {
            if (!result || result == '') {
                data.save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            } else {
                result[0].cross_selling_product_code=data.cross_selling_product_code,
                result[0].cross_selling_name=data.cross_selling_name,
                result[0].display_text=data.display_text
                result[0].save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            }
        })

    },
    getProductContent: function (ProductID, callback) {
console.log(ProductID)
        OAOProductDetail.find({ product_code: ProductID }, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },
     getUploadedDocuments:function(req,user,callback){
        console.log("in getUpload documents"+user);
        console.log(config_urls.url.alfresco_username);
        console.log(config_urls.url.alfresco_password);
        var auth = new Buffer(config_urls.url.alfresco_username+ ':' +config_urls.url.alfresco_password ).toString('base64');
        console.log(auth);
         var Headers = {
             Authorization: 'Basic ' + auth,
             contentType: req.mimetype
             };

    var uploaded,count=0;
    var fileNames=[];
    var objectIds=[];
    oaoApplicant.find({application_id:user},function(err,result){
        if(err)
            console.log("error in gettig applicant");
        else{
            console.log(result);
            uploaded = result[0].filesUpload;
            console.log("uploaded contains");
            console.log(uploaded);
            console.log(uploaded.length);
            if(uploaded.length >=1){
                var dir = './public/downloads/'+user;
                mkdirp(dir, function (err) {
                if (err) console.error(err)
                else 
                    console.log('Folder created')
                });
            console.log(uploaded[0].fileName);
            console.log(uploaded[0].fileObjectId);
           var promise = new Promise(function(resolve,reject){ 
            for(i=0;i<uploaded.length;i++)
                {
                     console.log(uploaded[i].fileName);
                     fileNames[i]=uploaded[i].fileName;
                     objectIds[i]=uploaded[i].fileObjectId;
                    // var urlis ='http://106.51.72.98:8180/alfresco/api/-default-/public/cmis/versions/1.0/atom/content/'+fileNames[i]+'?id='+objectIds[i]+'';
                    console.log("attahcmenst url",config_urls.url.cmis_alfresco_attachments_url);
                    var urlis = config_urls.url.cmis_alfresco_attachments_url+'id='+objectIds[i];
                     console.log(urlis);
                     request({url:urlis,headers: Headers}).pipe(fs.createWriteStream(''+dir+'/'+fileNames[i]+''))
                     .on('error',function(resp){
                        console.log("error in donwloading attachments");
                        console.log(resp);
                        callback(false,"Error in Downloading Attachment");
                     })
                     .on('finish', function(response) {

                        console.log("in response");
                        count++;
                        console.log("count in resp"+count);
                        if(count == uploaded.length){
                              console.log("in 1st then");
                                 resolve("alldone");
                            }
                        //console.log("done all downlaods");
                        
                        //console.log(count);
                       
                    
                        // unmodified http.IncomingMessage object 
                    
                     })
                     //resolve(count);
                 }
           }).then(function(e){
            console.log("value from 1st den is "+ e);
            callback(true,fileNames);

           });
                
                  

          
               /*
                if(count == uploaded.length)
                {
                    resolve("all done");
                    callback(true,fileNames);
                }*/

            }
            else{
                console.log("No Documents Uplaoded");
            callback(false,null);
            }
        }
    }) 
     
        
/*
  var urlis ='http://192.168.1.234:8080/alfresco/api/-default-/public/cmis/versions/1.0/atom/content/pass2.jpg?id=43246b05-66d6-495b-8d31-7e3d33eb1c67';
  
 request({url:urlis,headers: Headers}).pipe(fs.createWriteStream('./public/downloads/downloaded.png').on('finish',function(){
    console.log("done");
    callback(success = true);
 }));
*/
    },

    /*addProdTypeData: function (data, callback) {
        this.getProductTypeContent(data.product_type_code, function (result) {
            if (!result || result == '') {
                console.log(data)
                data.save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            } else {
                result[0].product_type_code = data.product_type_code,
                result[0].product_type_name = data.product_type_name,
                   
                result[0].save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            }
        })

    },
 */
    getProductTypeContent: function (ProductTypeCode, callback) {
        OAOProductTypeDetail.find({ product_type_code: ProductTypeCode }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },
   
   

    getProductByParent:function(product_code,child_of,callback){
        OAOProductDetail.find({product_code:product_code,child_of:child_of},function(err,result){
            if(err){
                return callback(err);
            }
            return callback(result);
        })
    }  ,   

    isProductDeletable:function(linked_crossselling_product,del_flg,callback){
        console.log("linked_crossselling_product db m: "+linked_crossselling_product);
        console.log("del db m: "+del_flg);
        //findOneAndUpdate({age: 17}, {$set:{name:"Naomi"}}
        OAOProductDetail.findOneAndUpdate({product_code:linked_crossselling_product},{$set:{del_flg:true}},{new:true},function(err,result){
            if(err){
                return callback(err);
            }
            return callback(result);
        })
    },

        Gen_coreAcc_no: function (callback) {
        var CORE_ACCOUNT_NUMBNER = "00000" + random.integer(1, 999);
        return callback(CORE_ACCOUNT_NUMBNER);
    },
    Gen_custId: function (callback) {
        var CORE_CUSTOMER_ID = random.integer(100000, 999999);
        return callback(CORE_CUSTOMER_ID);
    },
    /**Get property details by property type and property */
    getPropertyDetails:function(PropertyType,Property,callback){
        
        OAOPropertyDetail.find({property_type:PropertyType,property:Property},function(err,result){
            if(err){
                return callback(err);
            }
                return callback(result);
        })
    },
    getDropboxContent:function(PropertyType,Property,callback){
        console.log(PropertyType);
        console.log(Property);
         OAOPropertyDetail.find({property_type:PropertyType,property:Property},function(err,result){
            if(err){
                return callback(err);
            }
            console.log("res",result);
                return callback(result);
        })
    },
    UpdatePropertyDetails:function(PropertyType,Property,PropertyValue,callback){
        console.log(PropertyType);
        console.log(Property);
         OAOPropertyDetail.find({property_type:PropertyType,property:Property},function(err,result){
            if(err){
                return callback(err);
            }
            console.log("res",result);
            console.log("resval",result[0].property_value);
            result[0].property_value=PropertyValue;
            result[0].save(function(err,result){
                if(err){
                    return callback(err);
                }
                return callback(result);
            })

          
        })
    }
};