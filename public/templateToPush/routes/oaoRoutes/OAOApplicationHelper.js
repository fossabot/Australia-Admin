
var nodemailer = require('nodemailer');
var random = require("random-js")();
var config_urls = require("../../configFiles/DBconfigfile");
var fs = require('fs');
var jade = require('jade');
var speakeasy = require('speakeasy');
var secret = speakeasy.generateSecret();
var crypto = require("crypto");
var secret32=secret.base32;
var OAODBHelper = require("./OAODBHelper");
var request = require('request');
var cmis = require('cmis');
 var session = cmis.createSession(config_urls.url.cmis_alfresco_url);
session.setCredentials(config_urls.url.alfresco_username, config_urls.url.alfresco_password)
module.exports = {
    // alfrescoUpload: function (req, callack) {
    //     // console.log(req);
    //     var auth = new Buffer('admin' + ':' + 'alfrescoadmin@123').toString('base64');
    //     var headers = {
    //         Authorization: 'Basic ' + auth,
    //         contentType: req.mimetype
    //     }

    //     var formData = {
    //         filedata: fs.createReadStream(req.path),
    //         name: req.filename,

    //     };
    //     request.post({ url: 'http://106.51.65.119:8180/alfresco/api/-default-/public/alfresco/versions/1/nodes/96638165-37ab-481e-9841-4161a70b32f5/children/', formData: formData, headers: headers }, function optionalCallback(err, httpResponse, body) {
    //         if (err) {
    //             return console.error('upload failed:', err);
    //         }
    //         console.log('Upload successful!  Server responded with:', body);
    //         return callack(success = true);
    //     });
    //     //    return callack(success=true);
    // },
    
    cmisUpload: function (req, callack) {
        console.log("in cmis fun")

       
        session.loadRepositories().ok(function (data) {
            console.log(data)
            var parentId = config_urls.url.alfresco_folder_id;
            var content = fs.createReadStream(req.file.path);
            var input = {
                "cmis:name": req.file.filename,
                "cmis:objectTypeId": "D:onboarding:upload",
                "onboarding:mobile": req.headers.mobile,
                "onboarding:appid": req.headers.app_id
            }
            var mimeTypeExtension = req.file.mimetype;
            var policies = [];
            var addACEs;
            var removeACEs;
            var options;
            session.createDocument(parentId, content, input, mimeTypeExtension, policies, addACEs, removeACEs, options).ok(function (respo) {
                var arr = (respo.succinctProperties['alfcmis:nodeRef']).split('/');
                var file_obj_id = arr[3];
                var file_name = respo.succinctProperties['cmis:name'];
                OAODBHelper.saveUploadData(file_name, file_obj_id, req.headers.app_id, function (success) {
                    console.log(success)
                    return callack(success)
                })
            }).notOk(function (respo) {
                console.log(respo)
                return callack(success=false)
            })
            // session.getsRepositoryInfo(session);
        });
    },
    updateCimsProperties: function (app_id,cifid) {
        OAODBHelper.getApplicantsRecord(app_id, function (result) {
            var obj_id = [];
              var count = Object.keys(result[0].filesUpload).length;
                for (var i = 0; i < count; i++) {
                    obj_id.push(result[0].filesUpload[i].fileObjectId)
                }
                var properties={
                    "onboarding:cifid":cifid
                }
                session.loadRepositories().ok(function (data) {
                session.bulkUpdateProperties( obj_id, properties).ok(function(data){
                    console.log(data)
                }).notOk(function(data){
                    console.log(data)
                })
                });
        })
    },
    SendMail: function (email, app_id, data, emailTemplateId, callback) {
        var template;
        var mailOptions;
        if (emailTemplateId == 'SAVE_SUBMISSION') {
            console.log('Save Submission');
            template = process.cwd() + '/public/mailtemplate/saveconfirmation.jade';
        }else if(emailTemplateId =='SEND_OTP'){
             console.log('SEND OTP');
            template = process.cwd() + '/public/mailtemplate/sendOtp.jade';
        }else {
            console.log('Confirmation Submission');
            template = process.cwd() + '/public/mailtemplate/confirmation.jade';
        }
        fs.readFile(template, 'utf-8', function (err, file) {
            if (err) {
                console.log('Error while rendering jade template', template);
            } else {
                var compiledTmpl = jade.compile(file, { filename: template });
                var context = { applicationId: app_id, data: data };
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

                 if (emailTemplateId == 'SAVE_SUBMISSION') {
                    mailOptions = {
                        from: config_urls.url.gmailID, 
                        to: email, 
                        subject :'Application Saved Succesfully',
                        html: htmlToSend
                    };
                 }else if(emailTemplateId == 'FINAL_SUBMISSION' && data.product_type == 'Everyday Account'){
                       mailOptions = {
                        from: config_urls.url.gmailID, 
                        to: email, 
                        subject :'Application Processed Succesfully',
                        html: htmlToSend
                    };
                 }else if(emailTemplateId == 'SEND_OTP'){
                       mailOptions = {
                        from: config_urls.url.gmailID, 
                        to: email, 
                        subject :'OTP to resume saved appplication',
                        html: htmlToSend
                    };
                 }else{         
                       mailOptions = {
                        from: config_urls.url.gmailID, 
                        to: email, 
                        subject :'Application Submitted for processing succesfully',
                        html: htmlToSend
                    }; 
                 }
               

                /**
                 *  send mail with defined transport object 
                 */
                transporter.sendMail(mailOptions, function (error, info) {
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

    //Application Reference ID Generation

    RefIdFormater: function (ID,req,res) {
        dbSequence = Number(ID);
        var day = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
         OAODBHelper.UpdateApplicationReferenceIdGeneration(req, res, function(result) {
            })
        return AppRefID = ['DB', year,
            (month > 9 ? '' : '0') + month,
            (day > 9 ? '' : '0') + day,
            dbSequence
        ].join('');

    },

    Gen_coreAcc_no: function (callback) {
        var CORE_ACCOUNT_NUMBNER = "00000" + random.integer(1, 999);
        return callback(CORE_ACCOUNT_NUMBNER);
    },
    Gen_custId: function (callback) {
        var CORE_CUSTOMER_ID = random.integer(100000, 999999);
        return callback(CORE_CUSTOMER_ID);
    },

    BSB_Number: function (callback) {
        return callback(123123);
    },

    //To generate OTP
    genOTP:function(callback){
        // console.log("in gen otp:")
        // console.log(secret.base32)
        OAODBHelper.getDropboxContent('GENERIC_PROP','OTP_VALIDITY',function(result){
            console.log(result[0].property_value)
             var token = speakeasy.totp({
                secret: secret32,
                encoding: 'base32',
                step: parseInt(result[0].property_value)
            });
            console.log(token);
        return callback(token);
        })
         
    },
      verifyOTP:function(userToken,callack){
        //   console.log(userToken);
        //   console.log("in verifyOTP:")
        //   console.log(secret.base32)
        OAODBHelper.getDropboxContent('GENERIC_PROP','OTP_VALIDITY',function(result){
        var verified = speakeasy.totp.verify({
            secret: secret32,
            encoding: 'base32',
            step: parseInt(result[0].property_value),
            token: userToken            
        });
        console.log(verified);
        return callack(verified)
        })
    },
    sendOTPMessage:function(result,otp){
            console.log(result+"  "+otp)
    },
    sendOTPMail:function(result,otp){
            var data = {
                                'fname': result.fname,
                                'lname': result.lname,
                                'otp': otp
                            }
            this.SendMail(result.email,result.application_id,data,'SEND_OTP',function(result){
                    console.log(result)
            })
        
    }

}; //end of function