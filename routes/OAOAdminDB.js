var express = require('express');
var jwt = require('jsonwebtoken');
app = express();
var OAOProductDetail = require('../models/OAOProductSchema');
var OAOProductTypeDetail = require('../models/OAOProductTypeSchema');
var async = require("async");

var OAOModifyTheme = require('../models/OAOModifyThemeSchema');
var OAOAddNewField = require('../models/OAOAddNewFieldSchema');
var jsonfile = require('jsonfile');
var OAOAdminLogin = require('../models/OAOAdminLoginSchema');
var oaoApplicant = require('../models/OAOApplicantSchema');
var OAODBHelper = require("./OAODBHelper");
var cmis = require('cmis');
var config = require("../configFiles/DBconfigfile");
var configFeature = require("../configFiles/productTypeFeatures");
var applicationField = require("../configFiles/applicationfieldconfig");
var sectionConfig = require("../configFiles/sectionconfig");
var multer = require('multer');
const fs = require('fs');
var OAORouter = express.Router();
var constant = require('./AppConstants');
var request = require('request');
app.set('superSecret', 'samplekey');
var dir = "";
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {

        dir = './public/logo/';
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname)
    }
});
OAORouter.get('/getFreeFieldDetails', function (req, res, next) {
    OAOAddNewField.find({}, function (err, result) {
        res.json({ Result: result });
    })
})
OAORouter.get('/insertDefaultFields', function (req, res, next) {

    OAOAddNewField.update({
        $set: {
            SAV: [{
                section_1: [{
                    basic: [{
                        freetext1: [{

                        }],
                        freetext2: [{

                        }]
                    }],
                    contactinfo: [{
                        freetext1: [{

                        }],
                        freetext2: [{

                        }]
                    }]

                }],
                section_2: [{
                    taxinfo: [{
                        freetext1: [{

                        }],
                        freetext2: [{

                        }]
                    }]
                }],
                section_3: [{
                    idcheck: [{
                        freetext1: [{

                        }],
                        freetext2: [{

                        }]
                    }]
                }],

            }],
            HML: [{
                section_1: [{
                    basic: [{
                        freetext1: [{

                        }],
                        freetext2: [{

                        }]
                    }],
                    contactinfo: [{
                        freetext1: [{

                        }],
                        freetext2: [{

                        }]
                    }]

                }],

            }],
            PRL: [{
                section_1: [{
                    basic: [{
                        freetext1: [{

                        }],
                        freetext2: [{

                        }]
                    }],
                    contactinfo: [{
                        freetext1: [{

                        }],
                        freetext2: [{

                        }]
                    }]

                }],

            }],
        }
    }, function (err, result) {
        if (err) {
            return res.json({ ERROR: "ERROR" });
        }
        res.json({ RESULT: "success update" });
    })
})

OAORouter.post('/AddField', function (req, res, next) {
    console.log("request body", req.body);
    OAOAddNewField.find({}, function (err, result) {
        // res.json({ Result: result });
        result[0][req.body.product_type][0][req.body.section][0][req.body.section_name][0][req.body.freetext][0].label = req.body.label;
        result[0][req.body.product_type][0][req.body.section][0][req.body.section_name][0][req.body.freetext][0].placeholder = req.body.placeholder;
        result[0][req.body.product_type][0][req.body.section][0][req.body.section_name][0][req.body.freetext][0].status = req.body.status;
        console.log("result after adding fields", result)

        result[0].save(function (result) {
            if (result == null) {
                res.json({ Result: result });
            }
        })
    })
    // var oAOAddNewField = new OAOAddNewField({
    //     SAV: [{
    //         section_1: [{
    //             basic: [{
    //                 freetext1: [{
    //                     label: req.body.label,
    //                     placeholder: req.body.placholder,
    //                     status:req.body.status
    //                 }],
    //                 freetext2: [{
    //                     label: req.body.label1,
    //                     placeholder: req.body.placholder1,
    //                     status:req.body.status1
    //                 }]
    //             }],
    //             contactinfo: [{
    //                 freetext1: [{
    //                     label: 'FreeText1',
    //                     placeholder: 'XX'
    //                 }],
    //                 freetext2: [{
    //                     placeholder: 'XXX',
    //                     status: false,
    //                 }]
    //             }]
    //         }],

    //     }]
    // });
    // OAOAddNewField.find({}, function (err, result) {
    //     if (result == "") {
    //         console.log("save");
    //         oAOAddNewField.save(function (err, result) {
    //             if (err) {
    //                 return res.json({ ERROR: "ERROR" });
    //             }
    //             res.json({ RESULT: "success" });

    //         })
    //     } else {
    //         console.log("update");

    //         OAOAddNewField.update({
    //             $set: {
    //                 SAV: [{
    //                     section_1_: [{
    //                         basic: [{
    //                             freetext1: [{
    //                                 label: req.body.label,
    //                                 placeholder: 'XXXXX'
    //                             }],
    //                             freetext2: [{
    //                                 placeholder: 'X',
    //                                 status: false,
    //                             }]
    //                         }],
    //                         contactinfo: [{
    //                             freetext1: [{
    //                                 label: 'FreeText1',
    //                                 placeholder: 'XX'
    //                             }],
    //                             freetext2: [{
    //                                 placeholder: 'XXX',
    //                                 status: false,
    //                             }]
    //                         }]
    //                     }],

    //                 }]
    //             }
    //         }, function (err, result) {
    //             if (err) {
    //                 return res.json({ ERROR: "ERROR" });
    //             }
    //             res.json({ RESULT: "success update" });
    //         })

    //     }
    // })
})
//  COLOR CHANGE CODE

OAORouter.post('/customeStyle', function(req, res, next) {
    console.log(req.body);
    var oAOModifyTheme = new OAOModifyTheme({

        background_color: req.body.background_color,
        text_color: req.body.text_color,
        font_family: req.body.font_family,
        bck_btn_color: req.body.bck_btn_color,
        progress_bar_1: req.body.progress_bar_1,
        progress_bar_2: req.body.progress_bar_2,
        updated_flag: 'true',
        reset_flag: 'false'


    });

    OAOModifyTheme.find({}, function(err, result) {
        if (result == "") {
            console.log("save");
            oAOModifyTheme.save(function(err, result) {
                if (err) {
                    return res.json({ ERROR: "ERROR" });
                }
                res.json({ RESULT: "STYLE ADDED" });

            })
        } else {
            console.log("update");

            OAOModifyTheme.update({
                $set: {
                    background_color: req.body.background_color,
                    text_color: req.body.text_color,
                    font_family: req.body.font_family,
                    bck_btn_color: req.body.bck_btn_color,
                    progress_bar_1: req.body.progress_bar_1,
                    progress_bar_2: req.body.progress_bar_2,
                    updated_flag: 'true',
                    reset_flag: 'false'
                }
            }, function(err, result) {
                if (err) {
                    return res.json({ ERROR: "ERROR" });
                }
                res.json({ RESULT: "STYLE UPDATED" });
            })

        }
    })

})

OAORouter.get('/updateThemeStyleFlag', function(req, res, next) {
    OAOModifyTheme.update({
        $set: {
            updated_flag: 'false'
        }
    }, function(err, result) {
        if (err) {
            return res.json({ ERROR: "ERROR" });
        }
        res.json({ RESULT: "STYLE UPDATED" });
    })
})

OAORouter.get('/resetThemeStyleFlag', function(req, res, next) {
    OAOModifyTheme.update({
        $set: {
            reset_flag: 'true'
        }
    }, function(err, result) {
        if (err) {
            return res.json({ ERROR: "ERROR" });
        }
        res.json({ RESULT: "STYLE RESETED" });
    })
})


OAORouter.get('/getCustomeTheme', function(req, res, next) {
    OAOModifyTheme.find({}, function(err, result) {
        res.json({ Result: result });
    })
})

 //  END COLOR CHANGE CODE

OAORouter.get('/encryption/:encryptMsg', function (req, res, next) {

    var msg = req.params.encryptMsg;

    OAODBHelper.encryption(msg, function (result) {
        res.json({ key: result });
    })

})

OAORouter.post('/decryption', function (req, res, next) {

    var msg = req.body.decryptMsg;

    OAODBHelper.decryption(msg, function (result) {
        res.json({ key: result });
    })

})

 OAORouter.get('/getLOGO', function(req, res, next) {
     dir = './public/logo/';
     console.log("inlogo");
     const path = require('path');
     fs.readdir(dir, (err, files) => {
         if (err) throw error;

         for (const file of files) {
             console.log("inlogo12");
             res.json({ logoName: config.url.adminUrl+"/logo/" + file });
           
         }
     });

 })
var upload = multer({ //multer settings
    storage: storage
}).single('file')
//

 OAORouter.post('/upload', function(req, res, next) {

     dir = './public/logo/';
     const path = require('path');
     fs.readdir(dir, (err, files) => {
         if (err) throw error;

         for (const file of files) {
             fs.unlink(path.join(dir, file), err => {
                 if (err) throw error;
             });


         }

     });


     upload(req, res, function(err) {
         // console.log(req);


         if (!err) {
             res.json({ success: true });
         } else {
             res.status(500).json({
                 success: false
             });
         }

         //  OAOApplicationHelper.alfrescoUpload(req.file,function(success){
         //     console.log(success);
         // })

     })

 });

OAORouter.get("/fileExists", function (req, res) {
    var path = './public/template/template.zip';
    if (fs.existsSync(path)) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

OAORouter.get("/pushFileExists", function (req, res) {
    var path = './public/template/template_push.zip';
    if (fs.existsSync(path)) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

OAORouter.get("/renameFile", function (req, res) {
    var path = './public/template/template.zip';
    var path1 = './public/template/template_push.zip';
    if (fs.existsSync(path)) {
        fs.rename(path, path1, function (err) {
            if (err) throw err;
            fs.stat(path1, function (err, stats) {
                if (err) throw err;
                console.log('stats: ' + JSON.stringify(stats));
                res.json({ success: true });
            });
        });
    } else {
        res.json({ success: false });
    }
});

 OAORouter.get('/deleteFile', function(req, res, next) {
     dir = './public/logo/';
     const path = require('path');
     fs.readdir(dir, (err, files) => {
         if (err) throw error;

         for (const file of files) {
             fs.unlink(path.join(dir, file), err => {
                 if (err) throw error;
             });


         }
         res.json({ success: true });
     });

 })


OAORouter.route('/loginProcess')
    .post(function (req, res) {
        console.log(req.body);
        if (req.body == null) {
            res.json({ Result: "not valid request" });
        }
        OAOAdminLogin.findOne({ username: req.body.username, password: req.body.password }, function (err, result) {

            if (result == null) {
                res.json({ status: "Invalid" });
            } else {
                var token = jwt.sign(result.username, app.get('superSecret'));
                console.log("username is ", result.username);
                res.json({
                    status: "Authenticated",
                    username: result.username,
                    token: token
                });
            }

        })
    })
OAORouter.route('/AddUser').post(function (req, res) {
    var oAOAdminLogin = new OAOAdminLogin(req.body);

    oAOAdminLogin.save(function (err, result) {
        if (err) {
            console.log(err);
            res.json({ Result: err });

        } else {
            res.json({ result: "success" });
        }

    })
})
OAORouter.route('/ChangePassword').post(function (req, res) {
    console.log(req.body);
    console.log("changing password..");
    OAOAdminLogin.findOne({ username: req.body.username, password: req.body.password }, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ Result: err });

        } if (result == null) {
            res.json({ status: "Invalid" });
        } else {
            console.log(result);
            console.log("======");
            result.password = req.body.newpassword;
            result.save(function (result) {
                if (result == null) {
                    res.json({ Result: "Password changed" });
                }
            })
        }

    })
})
OAORouter.route('/AddloginDetails')
    .post(function (req, res) {
        var oAOAdminLogin = new OAOAdminLogin(req.body);

        oAOAdminLogin.save(function (err, result) {
            res.json({ Result: result });
        })
    })

OAORouter.route('/getCustDetails/:param_user')

    .get(function (req, res) {
        var tot_apps = {};
        var query = { assigned_to: req.params.param_user, applicant: { $ne: "secondary" } };
        async.parallel({
            getTotalApplication: function (callback) {
                console.log("All Applications");
                oaoApplicant.find({ "assigned_to": { $ne: req.params.param_user }, applicant: { $ne: "secondary" } }, null, { sort: { application_id: -1 } }).exec(callback)
            },
            getAssignedApplications: function (callback) {
                console.log("Assigned Applications");
                oaoApplicant.find(query, null, { sort: { application_id: -1 } }).exec(callback)
            },
        }, function (err, result1) {
            //console.log(res);
            console.log("sending result");
            res.json({ Result: result1.getTotalApplication, Another_Result: result1.getAssignedApplications });
        })
        /*
        var query = { assigned_to: req.params.param_user, applicant: { $ne: "secondary" } };
        oaoApplicant.find({ "assigned_to": { $ne: req.params.param_user }, applicant: { $ne: "secondary" } }, null, { sort: { application_id: -1 } }, function (err, result) {
            if (err) {
                console.log("error in getting Applicaitons" + err);
                res.json({ Result: null });
            }
            else {
                console.log("result is all application",result);
                oaoApplicant.find(query, null, { sort: { application_id: -1 } }, function (err, another_result) {

                    if (err) {
                        //console.log("error in getting Applicaitons");
                        res.json({ Result: null });
                    }
                    else {
                       // console.log("Assigned applcaiitons",another_result);
                        res.json({ Result: result, Another_Result: another_result });
                    }
                })
            }
        })*/
    })

OAORouter.route('/getAdminsDetails')
    .get(function (req, res) {
        OAOAdminLogin.find({}, function (err, result) {
            //console.log(result);
            res.json({ Result: result })
        });

    });

OAORouter.route('/getSingleCustomer/:param_id')
    .get(function (req, res) {
        var id = req.params.param_id;

        oaoApplicant.find({ application_id: id }, function (err, result) {
            res.json({ Result: result })
        })
    })

OAORouter.route('/AnalyticsData')
    .get(function (req, res) {
        oaoApplicant.aggregate([
            {
                $group: {
                    _id: '$product_type',  //$region is the column name in collection
                    count: { $sum: 1 }
                }
            }
        ], function (err, result) {
            res.json({ Result: result });
        })
    })

OAORouter.route('/TotalApplications/:camp/:startdate/:enddate')
    .get(function (req, res) {
        var camp = req.params.camp;
        var startdate = req.params.startdate;
        var enddate = req.params.enddate;
        var query = {};
        if (camp != null && camp != "null")
            query["campaign_id"] = new RegExp("^" + camp + "$", 'i');
        query["product_type_code"] = { $ne: "CRS" };
        if (startdate == enddate)
            query["cre_time"] = { "$gte": new Date(startdate) };
        else
            query["cre_time"] = { "$gte": new Date(startdate), "$lte": new Date(enddate) };

        console.log("query in totalApplcaition" + query);
        // /{"product_type_code":{$ne:"CRS"},"campaign_id":camp}
        oaoApplicant.count(query, function (err, result) {
            res.json({ Result: result });
        })
    })

OAORouter.route('/NewExistingCustomer/:cmp/:incmp/:active/:campaign/:startdate/:enddate')
    .get(function (req, res) {
        var cmp = req.params.cmp;
        var incmp = req.params.incmp;
        var active = req.params.active;
        var campaign = req.params.campaign;
        var startdate = req.params.startdate;
        var enddate = req.params.enddate;
        var query = {};
        console.log(cmp + incmp + active + campaign);
        if (campaign != "null" && campaign != "") {
            query["campaign_id"] = new RegExp("^" + campaign + "$", 'i');
        }
        if (cmp == "true") {
            query["application_status"] = "CMP";
        }
        else if (incmp == "true") {
            query["application_status"] = "INCMP";
        }
        else if (active == "true") {
            query["application_status"] = "SAV";
        }

        query["product_type_code"] = { $ne: 'CRS' };
        if (startdate == enddate)
            query["cre_time"] = { "$gte": new Date(startdate) };
        else
            query["cre_time"] = { "$gte": new Date(startdate), "$lte": new Date(enddate) };
        console.log("Query to get total count");
        console.log(query);

        oaoApplicant.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    _id: '$existing_cust_status',  //$region is the column name in collection
                    count: { $sum: 1 }
                }
            }
        ], function (err, result) {
            res.json({ Result: result });
        })
    })

OAORouter.route('/ApplicationOnStatus')
    .get(function (req, res) {
        oaoApplicant.aggregate([
            {
                $group: {
                    _id: '$application_status',  //$region is the column name in collection
                    count: { $sum: 1 }
                }
            }
        ], function (err, result) {
            res.json({ Result: result });
        })
    })

OAORouter.route('/getActiveRecords')
    .get(function (req, res) {
        oaoApplicant.aggregate([
            {
                $match: {
                    'cre_time': new Date()
                }

            },
            {
                $group: {
                    _id: '$product_type',  //$region is the column name in collection
                    count: { $sum: 1 }
                }
            }
        ], function (err, result) {
            res.json({
                Result: result,
                Date: new Date()
            });
        })
    })

//SECTION RESULT FOR EVRYDAY ACCOUNT STARTS

OAORouter.route('/section1Details/:params1')
    .get(function (req, res) {
        var App_type = req.params.params1;
        oaoApplicant.aggregate([
            {
                $match: {
                    'product_type': App_type,
                }
            }, {
                $match: {
                    'section_EVR.section_1': false,
                }
            },
            {
                $group: {
                    _id: '$section_EVR.section_1',
                    count: { $sum: 1 }
                }
            }

        ], function (err, result) {
            res.json({
                Result: result
            });
        })
    })

OAORouter.route('/section2Details/:params1')
    .get(function (req, res) {
        var App_type = req.params.params1;
        oaoApplicant.aggregate([
            {
                $match: {
                    'product_type': App_type,
                }
            }, {
                $match: {
                    'section_EVR.section_2': false,
                }
            },
            {
                $group: {
                    _id: '$section_EVR.section_2',
                    count: { $sum: 1 }
                }
            }

        ], function (err, result) {
            res.json({
                Result: result
            });
        })
    })

OAORouter.route('/section3Details/:params1')
    .get(function (req, res) {
        var App_type = req.params.params1;
        oaoApplicant.aggregate([
            {
                $match: {
                    'product_type': App_type,
                }
            }, {
                $match: {
                    'section_EVR.section_3': false,
                }
            },
            {
                $group: {
                    _id: '$section_EVR.section_3',
                    count: { $sum: 1 }
                }
            }

        ], function (err, result) {
            res.json({
                Result: result
            });
        })
    })


//SECTION RESULT FOR EVRYDAY ACCOUNT ENDS

//SECTION RESULT FOR HOME LOAN STARTS

OAORouter.route('/section1DetailsHML/:params1')
    .get(function (req, res) {
        var App_type = req.params.params1;
        oaoApplicant.aggregate([
            {
                $match: {
                    'product_type': App_type,
                }
            }, {
                $match: {
                    'section_HML.section_1': false,
                }
            },
            {
                $group: {
                    _id: '$section_HML.section_1',
                    count: { $sum: 1 }
                }
            }

        ], function (err, result) {
            res.json({
                Result: result
            });
        })
    })

OAORouter.route('/section2DetailsHML/:params1')
    .get(function (req, res) {
        var App_type = req.params.params1;
        oaoApplicant.aggregate([
            {
                $match: {
                    'product_type': App_type,
                }
            }, {
                $match: {
                    'section_HML.section_2': false,
                }
            },
            {
                $group: {
                    _id: '$section_HML.section_2',
                    count: { $sum: 1 }
                }
            }

        ], function (err, result) {
            res.json({
                Result: result
            });
        })
    })

OAORouter.route('/section3DetailsHML/:params1')
    .get(function (req, res) {
        var App_type = req.params.params1;
        oaoApplicant.aggregate([
            {
                $match: {
                    'product_type': App_type,
                }
            }, {
                $match: {
                    'section_HML.section_3': false,
                }
            },
            {
                $group: {
                    _id: '$section_HML.section_3',
                    count: { $sum: 1 }
                }
            }

        ], function (err, result) {
            res.json({
                Result: result
            });
        })
    })


//SECTION RESULT FOR PERSONAL LOAN

OAORouter.route('/section1DetailsPRL/:params1')
    .get(function (req, res) {
        var App_type = req.params.params1;
        oaoApplicant.aggregate([
            {
                $match: {
                    'product_type': App_type,
                }
            }, {
                $match: {
                    'section_PRL.section_1': false,
                }
            },
            {
                $group: {
                    _id: '$section_PRL.section_1',
                    count: { $sum: 1 }
                }
            }

        ], function (err, result) {
            res.json({
                Result: result
            });
        })
    })

OAORouter.route('/section2DetailsPRL/:params1')
    .get(function (req, res) {
        var App_type = req.params.params1;
        oaoApplicant.aggregate([
            {
                $match: {
                    'product_type': App_type,
                }
            }, {
                $match: {
                    'section_PRL.section_2': false,
                }
            },
            {
                $group: {
                    _id: '$section_PRL.section_2',
                    count: { $sum: 1 }
                }
            }

        ], function (err, result) {
            res.json({
                Result: result
            });
        })
    })

OAORouter.route('/section3DetailsPRL/:params1')
    .get(function (req, res) {
        var App_type = req.params.params1;
        oaoApplicant.aggregate([
            {
                $match: {
                    'product_type': App_type,
                }
            }, {
                $match: {
                    'section_PRL.section_3': false,
                }
            },
            {
                $group: {
                    _id: '$section_PRL.section_3',
                    count: { $sum: 1 }
                }
            }

        ], function (err, result) {
            res.json({
                Result: result
            });
        })
    })

//SECTION RESULT FOR EVRYDAY ACCOUNT ENDS

OAORouter.route('/ApplicationOnDeviceType/:cmp/:incmp/:active/:campaign/:startdate/:enddate')
    .get(function (req, res) {
        var cmp = req.params.cmp;
        var incmp = req.params.incmp;
        var active = req.params.active;
        var campaign = req.params.campaign;
        var startdate = req.params.startdate;
        var enddate = req.params.enddate;
        var query = {};
        console.log(cmp + incmp + active + campaign);
        if (campaign != "null" && campaign != "") {
            query["campaign_id"] = new RegExp("^" + campaign + "$", 'i');
        }
        query["product_type_code"] = { $ne: 'CRS' };
        if (cmp == "true") {
            query["application_status"] = "CMP";
        }
        else if (incmp === "true") {
            query["application_status"] = "INCMP";
        }
        else if (active === "true") {
            query["application_status"] = "SAV";
        }
        if (startdate == enddate)
            query["cre_time"] = { "$gte": new Date(startdate) };
        else
            query["cre_time"] = { "$gte": new Date(startdate), "$lte": new Date(enddate) };

        console.log("Query to get total count");
        console.log(query);

        oaoApplicant.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    _id: '$deviceType',  //$region is the column name in collection
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    '_id': 1

                }
            }
        ], function (err, result) {
            res.json({ Result: result });
        })
    })

OAORouter.route('/botContactedFields/:cmp/:incmp/:active/:campaign/:startdate/:enddate')
    .get(function (req, res) {
        var cmp = req.params.cmp;
        var incmp = req.params.incmp;
        var active = req.params.active;
        var campaign = req.params.campaign;
        var startdate = req.params.startdate;
        var enddate = req.params.enddate;
        var query = {};
        console.log(cmp + incmp + active + campaign);
        if (campaign != "null" && campaign != "") {
            query["campaign_id"] = new RegExp("^" + campaign + "$", 'i');
        }
        if (cmp == "true") {
            query["application_status"] = "CMP";
        }
        else if (incmp == "true") {
            query["application_status"] = "INCMP";
        }
        else if (active == "true") {
            query["application_status"] = "SAV";
        }

        query["product_type_code"] = { $ne: 'CRS' };
        if (startdate == enddate)
            query["cre_time"] = { "$gte": new Date(startdate) };
        else
            query["cre_time"] = { "$gte": new Date(startdate), "$lte": new Date(enddate) };
        console.log("Query to get total count");
        console.log(query);

        oaoApplicant.aggregate([
            {
                $match: query
            },
            {
                $sort: {
                    'bot_fields.noOfRemaindersSent': -1

                }
            },

            {
                $group: {
                    _id: '$bot_fields.noOfRemaindersSent',  //$region is the column name in collection
                    count: { $sum: 1 }
                }
            }
        ], function (err, result) {
            console.log(result);
            res.json({ Result: result });
        })
    })

OAORouter.route('/botContactedFieldsForStatus/:param1')
    .get(function (req, res) {
        var App_Status = req.params.param1;
        oaoApplicant.aggregate([
            {
                $match: {
                    //   'bot_fields.botContacted':'Y',
                    'application_status': App_Status
                }
            },
            {
                $sort: {
                    'bot_fields.noOfRemaindersSent': -1

                }
            },

            {
                $group: {
                    _id: '$bot_fields.noOfRemaindersSent',  //$region is the column name in collection
                    count: { $sum: 1 }
                }
            }
        ], function (err, result) {
            res.json({ Result: result });
        })
    })



OAORouter.route('/ApplicationOnDeviceTypeForProduct/:param1')
    .get(function (req, res) {
        var App_Status = req.params.param1;
        oaoApplicant.aggregate([
            {
                $match: {
                    'application_status': App_Status
                }
            }, {
                $sort: {
                    'deviceType': -1

                }
            },
            {
                $group: {
                    _id: '$deviceType',  //$region is the column name in collection
                    count: { $sum: 1 }
                }
            }
        ], function (err, result) {
            res.json({ Result: result });
        })
    })

OAORouter.route('/CompletedAppForAllProductType/:param1')
    .get(function (req, res) {
        var App_Status = req.params.param1;
        console.log(App_Status);

        oaoApplicant.aggregate([
            {
                $match: {
                    'application_status': App_Status
                }
            },
            {
                $group: {
                    _id: '$product_type',  //$region is the column name in collection
                    // order:'$product_type',
                    count: { $sum: 1 }
                }
            }
        ], function (err, result) {
            res.json({ Result: result });
        })
    })

// CROSS CELL PRODUCTS API's
OAORouter.route('/CrossProductsCount')
    .get(function (req, res) {
        //  oaoApplicant.aggregate([{
        //          $match: {
        //              'product_type_code': 'CRS',
        //          }
        //      },
        //      {
        //          $group: {
        //              _id: '$product_code',
        //              // order:'$product_type',
        //              count: { $sum: 1 }
        //          }
        //      }
        //  ], function(err, result) {
        //      res.json({ Result: result });
        //  })
        OAODBHelper.getAllCrossSellingProducts(function (result) {
            var prod_code = [];
            for (var i in result) {
                //  console.log(result[i]._id);
                prod_code.push(result[i].product_code);
                console.log(prod_code);
            }

            oaoApplicant.aggregate([{
                $match: {
                    'product_type_code': 'CRS',
                    'product_code': { $in: prod_code }
                }
            },
            {
                $group: {
                    _id: '$product_code',
                    // order:'$product_type',
                    count: { $sum: 1 }
                }
            }
            ], function (err, result) {
                res.json({ Result: result });
            })

        })
    })

OAORouter.route('/GetAllCrossSellingProducts')
    .get(function (req, res) {
        OAODBHelper.getAllCrossSellingProducts(function (result) {
            res.json({ result: result });
        })
    });

OAORouter.route('/CrossProductTypeCount/:params1')
    .get(function (req, res) {
        var product_code = req.params.params1;
        oaoApplicant.aggregate([{
            $match: {
                'product_code': product_code,
            }
        },
        {
            $group: {
                _id: '$cross_sell.main_prod',
                count: { $sum: 1 }
            }
        }

        ], function (err, result) {
            res.json({
                Result: result
            });
        })
    })
OAORouter.route('/AnalysDataOfProductTypeRequest/:cmp/:incmp/:active/:campaign/:startdate/:enddate')
    .get(function (req, res) {
        var cmp = req.params.cmp;
        var incmp = req.params.incmp;
        var active = req.params.active;
        var campaign = req.params.campaign;
        var startdate = req.params.startdate;
        var enddate = req.params.enddate;
        var query = {};
        console.log(cmp + incmp + active + campaign);
        if (campaign != "null" && campaign != "") {
            query["campaign_id"] = new RegExp("^" + campaign + "$", 'i');
        }
        if (cmp == "true") {
            query["application_status"] = "CMP";
        }
        else if (incmp == "true") {
            query["application_status"] = "INCMP";
        }
        else if (active == "true") {
            query["application_status"] = "SAV";
        }

        query["product_type_code"] = { $ne: 'CRS' };
        if (startdate == enddate)
            query["cre_time"] = { "$gte": new Date(startdate) };
        else
            query["cre_time"] = { "$gte": new Date(startdate), "$lte": new Date(enddate) };
        console.log("Query to get total count");
        console.log(query);

        oaoApplicant.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    _id: '$product_code',  //$region is the column name in collection
                    // order:'$product_type',
                    count: { $sum: 1 }
                }
            }
        ], function (err, result) {
            console.log("result in getting prodcut chart");
            console.log(result);
            res.json({ Result: result });
        })
    })

OAORouter.route('/CompleteANDIncompleteApp/:camp/:startdate/:enddate')
    .get(function (req, res) {
        var camp = req.params.camp;
        var startdate = req.params.startdate;
        var enddate = req.params.enddate;
        var query = {};
        if (camp != null && camp != "null")
            query["campaign_id"] = new RegExp("^" + camp + "$", 'i');
        query["product_type_code"] = { $ne: "CRS" };
        if (startdate == enddate)
            query["cre_time"] = { "$gte": new Date(startdate) };
        else
            query["cre_time"] = { "$gte": new Date(startdate), "$lte": new Date(enddate) };
        console.log("query in totalApplcaition" + query);

        oaoApplicant.aggregate([
            {
                $match: query
            },
            {
                $sort: {
                    'application_status': -1

                }
            },
            {

                $group: {
                    _id: '$application_status',  //$region is the column name in collection
                    // order:'$product_type',
                    count: { $sum: 1 }
                }
            }
        ], function (err, result) {
            res.json({ Result: result });
        })
    })

OAORouter.route('/AddOrUpdateComment')
    .post(function (req, res) {
        app_id = req.body.application_id;

        oaoApplicant.find({ application_id: app_id }, function (err, result) {

            if (result == '') {
                res.json({ status: "Invalid" });
            } else {
                result[0].comments = req.body.comment;
                //  console.log(result);
                result[0].save(function (result) {
                    if (result == null) {
                        res.json({ Result: "Comment Saved" });
                    }
                })
            }
        })
    })

OAORouter.route('/addLogs')
    .post(function (req, res) {
        id = req.body.application_id;

        console.log("Application Id : " + id);
        console.log(req.body);

        var body_who = req.body.who;
        var body_type = req.body.change_type;
        var body_from = req.body.from;
        var body_to = req.body.to;
        var body_comment = req.body.comments;
        var dropdown_value = req.body.dropdown_val;
        var flag = req.body.flag;
        console.log("dropdown value is" + dropdown_value);
        var body_from1 = req.body.from1;
        var body_to1 = req.body.to1;
        var status;
        var query1;
        if (dropdown_value == "all") {
            query1 = { applicant: { $ne: "secondary" } };
        }
        else {
            query1 = { assigned_to: dropdown_value, applicant: { $ne: "secondary" } };
        }
        if (body_to == "Complete") {
            status = constants.COMPLETED;
        }
        else if (body_to == "Incomplete") {
            status = constants.INCOMPLETE;
        }
        else if (body_to == "Active") {
            status = constants.ACTIVE;

        }
        else {
            status = body_to;
        }


        var logs_details = {
            who: body_who,
            change_type: body_type,
            from: body_from,
            to: body_to,
            comment: body_comment
        }
        console.log("logdetails");
        console.log(logs_details);

        //res.json({Result:'saved'});
        var query = { 'application_id': id };
        var update;
        if (body_type == 1) {
            console.log("in type 1");
            console.log("update");
            console.log(status);
            update = {
                application_status: status,
                $push: {
                    logs: logs_details
                }
            };

        }
        else if (body_type == 2) {
            console.log("in type 2");
            update = {
                assigned_to: body_to,
                $push: {
                    logs: logs_details
                }
            };
        }
        else if (body_type == 3) {
            console.log("in type 3");
            var logs_details1 = {
                who: body_who,
                change_type: 1,
                from: body_from,
                to: body_to
            };
            var logs_details2 = {
                who: body_who,
                change_type: 2,
                from: body_from1,
                to: body_to1,
                comment: body_comment
            };

            update = {
                application_status: status,
                assigned_to: body_to1,
                $push: {
                    logs: {
                        $each: [logs_details1, logs_details2]
                    }
                }
            }

        }
        else {
            console.log("in type 4");
            update = {
                $push: {
                    logs: logs_details
                }
            };

        }

        oaoApplicant.findOneAndUpdate(query, update, { new: true }, function (err, result) {
            if (err) {
                console.log(err);
                res.json({ Error: err });
            }
            else if (result == null) {
                console.log("NULL");
                res.json({ Error: null });
            }
            else {
                console.log("Result is");
                //console.log(result);
                var assigned_apps = {};
                if (flag == 1) {
                    async.parallel({
                        getAssignedApplications: function (callback) {
                            console.log("All Applications");
                            oaoApplicant.find(query1, null, { sort: { application_id: -1 } }).exec(callback)
                        },
                        getTotalApplications: function (callback) {
                            console.log("Assigned Applications");
                            oaoApplicant.find({ assigned_to: { $ne: dropdown_value }, applicant: { $ne: "secondary" } }, null, { sort: { application_id: -1 } }).exec(callback)
                        },
                    }, function (err, result) {
                        console.log("sending data");
                        res.json({ Result: result.getAssignedApplications, totalApplication: result.getTotalApplications });
                    });
                    /* oaoApplicant.find(query1, null, { sort: { application_id: -1 } }, function (err, result1) {
                          // console.log(res)
                          if (err) {
                              console.log(err);
                          }
                          else if (result == null) {
                              console.log("null is cmoing");
                              res.json({ Result: null })
                          }
                          else {
                              // console.log(result[0]);
                              oaoApplicant.find({ assigned_to: { $ne: dropdown_value } }, null, { sort: { application_id: -1 } }, function (err, result2) {
                                  if (err)
                                      console.log(err);
                                  else if (result == null) {
                                      console.log("null is cmoing");
                                      res.json({ Result: null })
                                  }
                                  else {
                                      console.log("assigned change sending updated values ");
                                      res.json({ Result: result1, totalApplication: result2 });
                                  }
  
                              })
  
                          }
                      });*/
                }
                else {
                    res.json({ Result: result });
                }
            }
        });
    })
OAORouter.route('/getLogs/:param_id')
    .get(function (req, res) {
        var id = req.params.param_id;
        console.log("id is " + id);
        oaoApplicant.find({ application_id: id }, { logs: 1, cre_time: 1 }, function (err, result) {
            if (err) {
                console.log(err);
                res.json({ Result: err });

            }
            else if (result == null) {
                console.log(null);
                res.json({ Result: null })
            }
            else {
                console.log(result);
                res.json({ Result: result });
            }
        });
    })

OAORouter.route('/getCommetsOnAppID/:param_id')
    .get(function (req, res) {
        var id = req.params.param_id;

        oaoApplicant.find({ application_id: id }, function (err, result) {
            res.json({ Result: result[0].comments })
        })
    })

OAORouter.route('/getFilteredApplicationDetails/:params1/:params2/:params3/:params4/:params5/:params6/:params7')
    .get(function (req, res) {
        var application_status = req.params.params1;
        var product_type_code = req.params.params2;
        var search_key = req.params.params3;
        var assigned = req.params.params4;
        var product_code = req.params.params5;
        var admin_name = req.params.params6;
        var campaign = req.params.params7;
        var flag = 0;
        console.log(campaign + "\t" + admin_name + "\t" + application_status + "\t" + product_type_code + "\t" + search_key + "\t" + assigned + "\t" + product_code);
        //var x = "{";{$ne:
        var query = {};
        query["assigned_to"] = { $ne: admin_name };
        if (application_status != "null" && application_status != "all") {
            query["application_status"] = application_status;
        }
        if (product_type_code != "null" && product_type_code != "all") {
            query["product_type_code"] = product_type_code;
        }
        if (product_code != "null" && product_code != "all") {
            query["product_code"] = product_code;
        }
        if (search_key != "null") {
            query["application_id"] = new RegExp(search_key, 'i');
        }
        if (campaign != "null") {
            query["campaign_id"] = new RegExp("^" + campaign + "$", 'i');
        }
        if (assigned != "null" && assigned != "all") {
            query["assigned_to"] = assigned;
        }


        /*if(application_status=='null' && product_type!='null' && search_key!='null'){
            console.log("condition 1");
            var query = {
                product_type:product_type,
                application_id:new RegExp(search_key, 'i')
            };
        }else if(application_status!='null' && product_type=='null' && search_key!='null'){
              var query = {
                application_status:application_status,
                application_id:new RegExp(search_key, 'i')
            };
        }else if(application_status!='null' && product_type!='null' && search_key=='null'){
            var query = {
                application_status:application_status,
                product_type:product_type
            };
        }else if(application_status!='null' && product_type!='null' && search_key!='null')
        {
             var query = {
                application_status:application_status,
                product_type:product_type,
                application_id:new RegExp(search_key, 'i')
            };
        }else if(application_status=='null' && product_type=='null' && search_key!='null'){
            var query = {
                application_id:new RegExp(search_key, 'i')
            };
        }else if(application_status!='null' && product_type=='null' && search_key=='null'){
            var query = {
                application_status:application_status,
            };
        }else if(application_status=='null' && product_type!='null' && search_key=='null'){
            var query = {
                product_type:product_type,
            };
        }
        
         if(application_status=='all' && product_type!='null'){
            var query ={
                product_type:product_type
            };
        }else if(application_status!='null' && product_type=='all'){
            var query ={
                 application_status:application_status
            };
        }
         if(application_status=='all' && product_type=='all'){
            var query ={
                 
            };assigned_to:{$ne:"admin"}
        }*/

        console.log(query);



        oaoApplicant.find(query, null, { sort: { application_id: -1 } }, function (err, result) {
            // console.log(res)
            if (err) {
                console.log("hi");
                console.log(err);
            }
            else if (result == "null" || result.length < 1) {
                console.log("null is cmoing");
                res.json({ Result: null })
            }
            else {
                console.log("hi1");
                console.log(result[0]);
                res.json({ Result: result })
            }
        });

        // oaoApplicant.find({application_status:application_status,product_type:product_type,application_id:new RegExp(search_key, 'i')},function(err,result){
        //     res.json({Result:result})
        // }) 
    })



//for all records
OAORouter.route('/ProductTypes')
    .get(function (req, res) {
        OAODBHelper.getProductType(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/ProductTypesAll')
    .get(function (req, res) {
        OAODBHelper.getProductTypeAll(function (result) {
            res.json({ result: result });
        })
    })
OAORouter.route('/Products')
    .get(function (req, res) {
        OAODBHelper.getProduct(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/ProductsAll')
    .get(function (req, res) {
        OAODBHelper.getProductAll(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/CrossSellingProducts')
    .get(function (req, res) {
        OAODBHelper.getCrossSellingProduct(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/DistinctCrossSellProduct')
    .get(function (req, res) {
        OAODBHelper.getDistinctCrossSellProduct(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/CrossSellingProductById/:ProductID')
    .get(function (req, res) {
        var ProductID = req.params.ProductID;
        OAODBHelper.getCrossSellProductById(ProductID, function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/pushToCore')
    .post(function (req, res) {
        console.log(req.body)
        console.log(req.body[0].application_status);
        app_id = req.body[0].application_id;
        console.log(app_id);
        oaoApplicant.find({ application_id: app_id }, function (err, result) {

            if (result == '') {
                res.json({ Result: "Invalid" });
            } else {
                result[0].application_status = "ONBOARD";

                console.log("generating cust id and acc no for hml or prl cust");
                OAODBHelper.Gen_custId(function (CallBackResult) {
                    result[0].core_customer_id = CallBackResult;
                })
                OAODBHelper.Gen_coreAcc_no(function (CallBackResult) {
                    result[0].core_account_number = CallBackResult;
                })



                console.log(result[0].application_status);
                result[0].save(function (result) {
                    if (result == null) {
                        res.json({ Result: "pushed" });
                    }
                })
            }
        })
    });
//Talk to legacy
OAORouter.route('/talkTolegacy')
    .post(function (req, res) {
        app_id = req.body.application_id;
        console.log(app_id);
        oaoApplicant.find({ application_id: app_id }, function (err, result) {

            if (result == '') {
                res.json({ Result: "Invalid" });
            } else {
                result[0].core_account_number = req.body.account_number;
                result[0].core_customer_id = req.body.customer_id;
                result[0].application_status = "ONBOARD";
                console.log(result[0].application_status);
                result[0].save(function (result) {
                    if (result == null) {
                        res.json({ Result: "pushed" });
                    }
                })
            }
        })
    });




//save  product type
OAORouter.route('/saveProductType')
    .post(function (req, res) {
        var OAOProductTypeDetail_v = new OAOProductTypeDetail({
            product_type_code: req.body.product_type_code,
            product_type_name: req.body.product_type_name,
            country_code: req.body.country_code
        });
        OAODBHelper.addProdTypeData(OAOProductTypeDetail_v, function (result) {
            if (!result) {
                return res.json({ result: "no record found" });
            }
            res.json({ result: result });
        })

    });
OAORouter.route('/saveAddon')
    .post(function (req, res) {
        console.log("Save Addon", req.body);
        // var linked_cross_sell = req.body.linked_crossselling_product;
        //var linked_up_sell = req.body.linked_upsell_product;
        var upsell_code;
        var cross_sell_code;
        var real_product_code = req.body.product_code;
        var product_name = req.body.product_name;
        var display_text = req.body.display_text;
        var display_text_upsell = req.body.display_text_upsell;
        var child_of = req.body.child_of;
        var del_flg = req.body.del_flg || 'false';
        var verification_mode = req.body.verification_mode;
        var new_cross_sell = req.body.new_cross_sell;
        var new_up_sell = req.body.new_up_sell;

        var OAOProductDetail_v;
        var realcode;
        console.log("Prosuct is product_code", real_product_code);
        if (child_of == constant.CROSSSELL) {
            OAODBHelper.getProductSequence(constant.CROSSSELL).then((result) => {
                console.log("sequence in admin db ", result);
                if (result != -1) {
                    seq_cross = parseInt(result);
                    seq_cross++;
                    var s = seq_cross + "";
                    var c = 3;
                    while (s.length < c) {
                        s = "0" + s;
                    }
                    cross_sell_code = constant.CROSSSELL + s;
                    console.log("ID to save is", cross_sell_code);
                    var realcode;
                    if (real_product_code != "" && real_product_code != undefined)
                        realcode = real_product_code
                    else
                        realcode = cross_sell_code

                    OAOProductDetail_v = new OAOProductDetail({
                        product_code: realcode,
                        product_name: product_name,
                        display_text: display_text,
                        child_of: child_of,
                        del_flg: del_flg || 'false',
                        sequence: s,
                        //verification_mode: verification_mode,
                    });
                    OAODBHelper.addData(OAOProductDetail_v, function (result) {
                        if (!result) {
                            return res.json({ result: "no record found" });
                        }
                        console.log("addded product", result);
                        res.json({ result: result });
                    })
                }
            });
        }
        else {
            OAODBHelper.getProductSequence(constant.UPSELL).then((result) => {
                console.log("sequence in admin db ", result);
                if (result != -1) {
                    seq_cross = parseInt(result);
                    seq_cross++;
                    var s = seq_cross + "";
                    var c = 3;
                    while (s.length < c) {
                        s = "0" + s;
                    }
                    upsell_code = constant.UPSELL + s;
                    console.log("ID to save is", upsell_code);
                    var realcode;
                    if (real_product_code != "" && real_product_code != undefined)
                        realcode = real_product_code
                    else
                        realcode = upsell_code

                    OAOProductDetail_v = new OAOProductDetail({
                        product_code: realcode,
                        product_name: product_name,
                        display_text_upsell: display_text,
                        child_of: child_of,
                        del_flg: del_flg || 'false',
                        sequence: s,
                        //verification_mode: verification_mode,
                    });
                    OAODBHelper.addData(OAOProductDetail_v, function (result) {
                        if (!result) {
                            return res.json({ result: "no record found" });
                        }
                        console.log("addded product", result);
                        res.json({ result: result });
                    })
                }
            });

        }






    })
//save sub product
OAORouter.route('/saveProduct')
    .post(function (req, res) {
        console.log("Save Producst Form", req.body);
        var cross_sell_Product;
        var up_sell_Product;
        var upsell_code;
        var cross_sell_code;
        var core_identifier = req.body.core_identifier;
        var linked_cross_sell = req.body.linked_crossselling_product;
        var linked_up_sell = req.body.linked_upsell_product;
        var real_product_code = req.body.product_code;
        var product_name = req.body.product_name;
        var display_text = req.body.display_text;
        var display_text_upsell = req.body.display_text_upsell;
        var child_of = req.body.child_of;
        var del_flg = req.body.del_flg || 'false';
        var verification_mode = req.body.verification_mode;
        var new_cross_sell = req.body.new_cross_sell;
        var new_up_sell = req.body.new_up_sell;
        console.log("NEW oR OLD crossel and upsell and product_Code", new_cross_sell, new_up_sell, real_product_code);

        new Promise((resolve, reject) => {
            if (new_cross_sell) {

                var seq_cross;
                OAODBHelper.getProductSequence(constant.CROSSSELL).then((result) => {
                    console.log("sequence in admin db ", result);
                    if (result != -1) {
                        seq_cross = parseInt(result);
                        seq_cross++;
                        // console.log("new squence is",seq);
                        var s = seq_cross + "";
                        //  console.log("lnegth is "+ s.length);
                        var c = 3;
                        while (s.length < c) {
                            //  console.log("c is",c,'length is',s.length);
                            s = "0" + s;

                        }


                        cross_sell_code = constant.CROSSSELL + s;
                        console.log("ID to save is", cross_sell_code);
                        cross_sell_Product = new OAOProductDetail({
                            product_code: cross_sell_code,
                            product_name: linked_cross_sell,
                            linked_crossselling_product: '',
                            linked_upsell_product: '',
                            display_text: display_text,
                            display_text_upsell: '',
                            child_of: constant.CROSSSELL,
                            del_flg: req.body.del_flg || 'false',
                            sequence: s,
                            verification_mode: ""

                        });
                    }
                    resolve("cross sell configured");
                });

            }
            else
                resolve("No crossell");
        }).then((e) => {
            console.log(e);
            return new Promise((resolve, reject) => {
                if (new_up_sell) {
                    var seq_cross;
                    OAODBHelper.getProductSequence(constant.UPSELL).then((result) => {
                        console.log("sequence in admin db ", result);
                        if (result != -1) {
                            seq_cross = parseInt(result);
                            // console.log("new squence is",seq);
                            seq_cross++;
                            var s = seq_cross + "";

                            //  console.log("lnegth is "+ s.length);
                            var c = 3;
                            while (s.length < c) {
                                //  console.log("c is",c,'length is',s.length);
                                s = "0" + s;

                            }


                            upsell_code = constant.UPSELL + s;
                            console.log("ID to save is", upsell_code);
                            up_sell_Product = new OAOProductDetail({
                                product_code: upsell_code,
                                product_name: linked_up_sell,
                                linked_crossselling_product: '',
                                linked_upsell_product: '',
                                display_text: '',
                                display_text_upsell: display_text_upsell,
                                child_of: constant.UPSELL,
                                del_flg: req.body.del_flg || 'false',
                                sequence: s,
                                verification_mode: ''

                            });
                        }
                        resolve("Upsell configured successfully");
                    });

                }
                else
                    resolve("no Upsell");
            })


        }).then((e) => {
            console.log(e);
            return new Promise((resolve, reject) => {


                if (new_cross_sell && !new_up_sell) {
                    OAODBHelper.addData(cross_sell_Product, function (result) {
                        // console.log("Added Cross alone");
                        resolve("Added Cross alone");
                    })
                }
                else if (!new_cross_sell && new_up_sell) {
                    OAODBHelper.addData(up_sell_Product, function (result) {
                        //console.log("Added UpSell alone");
                        resolve("Added UpSell alone");
                    })
                }
                else if (new_cross_sell && new_up_sell) {
                    OAODBHelper.addCrossOrUpsell(cross_sell_Product, up_sell_Product, function (result) {
                        //console.log("Added Croseell and UpSell together");
                        resolve("Added Croseell and UpSell together");

                    })
                }
                else {
                    resolve("NO CRoss Sell NO UpSell FOund");
                }

            });


        }).then((e) => {
            console.log(e);

            OAODBHelper.getProductSequence(child_of).then((result) => {
                console.log("Result in OAO AdminDB", result);
                var seq_cross;
                if (result != -1) {
                    seq_cross = parseInt(result);
                    // console.log("new squence is",seq);
                    seq_cross++;
                    var s = seq_cross + "";
                    //  console.log("lnegth is "+ s.length);
                    var c = 3;
                    while (s.length < c) {
                        s = "0" + s;
                    }
                    var code = child_of + s;
                    console.log("ID to save is", code);
                    if (cross_sell_code == undefined || cross_sell_code == "") {
                        console.log("Updating Db with exiting cross sell");
                        cross_sell_code = linked_cross_sell
                    }
                    if (upsell_code == undefined || upsell_code == "") {
                        console.log("Updating Db with exiting up sell");
                        upsell_code = linked_up_sell;
                    }
                    var realcode;
                    if (real_product_code != "" && real_product_code != undefined) {
                        console.log("Found Productcode", real_product_code);
                        realcode = real_product_code;
                    }
                    else {
                        realcode = code;
                    }
                    var OAOProductDetail_v = new OAOProductDetail({
                        product_code: realcode,
                        product_name: product_name,
                        core_identifier: core_identifier,
                        linked_crossselling_product: cross_sell_code,
                        linked_upsell_product: upsell_code,
                        display_text: display_text,
                        display_text_upsell: display_text_upsell,
                        child_of: child_of,
                        del_flg: del_flg || 'false',
                        sequence: s,
                        verification_mode: verification_mode,
                    });
                    OAODBHelper.addData(OAOProductDetail_v, function (result) {
                        if (!result) {
                            return res.json({ result: "no record found" });
                        }
                        console.log("addded product", result);
                        res.json({ result: result });
                    })
                }
            });
        });
    });


OAORouter.route('/IsProductDeletable/:linked_crossselling_product/:del_flg')
    .get(function (req, res) {
        var linked_crossselling_product = req.params.linked_crossselling_product;
        var del_flg = req.params.del_flg;
        var isProductDeletableFlag = false;
        console.log("linked_crossselling_product: " + linked_crossselling_product);
        console.log("del_flg: " + del_flg);
        OAODBHelper.isProductDeletable(linked_crossselling_product, del_flg, function (result) {
            console.log("result: ", result);
            // if (result.length == 0)
            isProductDeletableFlag = true;
            res.json({ Result: isProductDeletableFlag });
        })
    })
//get single product details
OAORouter.route('/ProductDetails/:ProductCode')
    .get(function (req, res) {
        var ProductCode = req.params.ProductCode;
        OAODBHelper.getProductContent(ProductCode, function (result) {
            res.json({ result: result });
        })
    });


//get single product type details
OAORouter.route('/ProductTypeDetails/:ProductTypeCode')
    .get(function (req, res) {
        var ProductTypeCode = req.params.ProductTypeCode;
        OAODBHelper.getProductTypeContent(ProductTypeCode, function (result) {
            res.json({ result: result });
        })
    });

//get single CrossSellingProductContent details
OAORouter.route('/CrossSellingProductDetails/:CrossSellingID')
    .get(function (req, res) {
        var CrossSellingID = req.params.CrossSellingID;
        OAODBHelper.getCrossSellingProductContent(CrossSellingID, function (result) {
            res.json({ result: result });
        })
    });
// //for all records
// OAORouter.route('/Products')
//     .get(function (req, res) {
//         OAODBHelper.getProduct(function (result) {
//             res.json({ result: result });
//         })
//     });
// OAORouter.route('/ProductTypes')
//     .get(function (req, res) {
//         OAODBHelper.getProductType(function (result) {
//             res.json({ result: result });
//         })
//     });
// OAORouter.route('/CrossSellingProducts')
//     .get(function (req, res) {
//         OAODBHelper.getCrossSellingProduct(function (result) {
//             res.json({ result: result });
//         })
//     });
OAORouter.route('/GetProduct/:product_code/:child_of')
    .get(function (req, res) {
        var product_code = req.params.product_code;
        var child_of = req.params.child_of;
        OAODBHelper.getSubProductByParent(product_code, child_of, function (result) {
            res.json({ result: result });
        })
    })
OAORouter.route('/SubProductDetails/:product_code')
    .get(function (req, res) {
        var product_code = req.params.product_code;
        OAODBHelper.getSubProductContent(product_code, function (result) {
            res.json({ result: result });
        })
    })

OAORouter.get('/getConfig', function (req, res) {
    res.json({ data: config });
});
OAORouter.route('/ProductTypes')
    .get(function (req, res) {
        OAODBHelper.getProductType(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.get('/getApplicationField', function (req, res) {
    res.json({ data: applicationField });
});
OAORouter.get('/getSectionConfig', function (req, res) {
    res.json({ data: sectionConfig });
});
OAORouter.route('/GetAllCrossSellingProducts')
    .get(function (req, res) {
        OAODBHelper.getAllCrossSellingProducts(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/GetAllUpSellingProducts')
    .get(function (req, res) {
        OAODBHelper.getAllUpSellingProducts(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/getAttachments/:user')
    .get(function (req, res) {
        console.log("in ATtcements" + req.params.user);


        OAODBHelper.getUploadedDocuments(req, req.params.user, function (success, fileNames) {
            console.log("success is");
            console.log(success);
            if (!success && fileNames == null) {
                res.json({ Result: null })
            }
            else if (!success && fileNames != null) {
                res.json({ Result: fileNames })
            }
            else {

                /*for(i=0;i<fileNames.length;i++)
                {   
                    //console.log("Inside Callback return");
                    console.log("filename"+fileNames[i]);
                    //console.log("objectid"+objectIds[i]);
                }*/
                res.json({ Result: { fileNames } });
            }
        })

    });

/**Get Property details by property type and property 
 * PropertyTypes?PROPERTYTYPE=GENERIC_PROP&PROPERTY=CORE_ACCOUNT_OPENING_MODE
*/
OAORouter.route('/GetPropertyTypes')
    .get(function (req, res) {
        var propertyType = req.query.PROPERTYTYPE;
        var property = req.query.PROPERTY;
        OAODBHelper.getPropertyDetails(propertyType, property, function (result) {
            res.json({ result: result });
        })
    });

OAORouter.route('/getContent')
    .get(function (req, res) {
        var output = null
        var output_content = null;
        var flag = false;
        var auth = new Buffer(config.url.alfresco_username + ':' + config.url.alfresco_password).toString('base64');
        console.log(auth);
        var Headers = {
            Authorization: 'Basic ' + auth,
            contentType: req.mimetype
        };

       // var urlis = 'http://106.51.72.98:8180/alfresco/api/-default-/public/cmis/versions/1.0/atom/content/Product1.json?id=289d5dfc-f3b0-4427-afc5-26a58ebe61bf';
         var urlis = config.url.cmis_alfresco_attachments_url+'id='+config.url.contents_file_id;
        console.log(urlis);
        var dir = './public/contents/Product1.json'
        request({ url: urlis, headers: Headers }).pipe(fs.createWriteStream(dir))
            .on('error', function (resp) {
                console.log("error in donwloading Product Contents");
                console.log(resp);
                callback(false, "Error in Downloading Product Contents");
            })
            .on('finish', function (response) {
                console.log("in response");
                jsonfile.readFile('./public/contents/Product1.json', function (err, data) {
                    if (err) {
                        console.log("error is reading json file" + err);
                        res.json({ success: false });
                    }
                    else {
                        output_content = data;
                        //flag = true;
                        console.log("done reading content", data);
                        res.json({ result: output_content, success: true });

                    }
                });
            })
    });

OAORouter.route('/UpdateProp/:PropertyType/:Property/:PropertyValue')
    .get(function (req, res) {
        console.log("updatijng property details");
        console.log(req.params.PropertyType);
        console.log(req.params.Property)
        var PropertyType = req.params.PropertyType;
        var Property = req.params.Property;
        var PropertyValue = req.params.PropertyValue;
        OAODBHelper.UpdatePropertyDetails(PropertyType, Property, PropertyValue, function (result) {
            console.log(result);
            res.json({ result: result });
        })
    })
OAORouter.route('/getLocalContent')
    .get(function (req, res) {
        console.log("indslkmlksd//////////////////////////////////////////////////////////////////////////////")
        jsonfile.readFile('./public/contents/Product1.json', function (err, data) {
            if (err) {
                console.log("error is reading json file" + err);
                res.json({ success: false });
            }
            else {
                output_content = data;
                //flag = true;
                console.log("done reading content", data);
                res.json({ result: output_content, success: true });

            }
        });
    });

OAORouter.route('/getFeatures')
    .get(function (req, res) {
        res.json({ data: configFeature });
    });
OAORouter.route('/UpdateProductFeatures')
    .post(function (req, res) {
        console.log("Inside Update Product Features");
        console.log(req.body);
        var obj = {};
        if ((req.body.product_code).match('SAV')) {
            obj = {
                
                min_age: req.body.min_age,
                max_age: req.body.max_age,
                interest_rate: req.body.interest_rate,
                bonus_interest_rate: req.body.bonus_interest,
                min_deposit:req.body.min_deposit,
                keeping_fees: req.body.keeping_fees,
                transaction_fees: req.body.transaction_fees,
               
                
            }
        }
        else {
             obj = {
                fixed_interest_rate:req.body.fixed_interest_rate,
                variable_interest_rate:req.body.variable_interest_rate,
                min_age: req.body.min_age,
                max_age: req.body.max_age,
                comparison_rate: req.body.comparison_rate,
                establishment_fees: req.body.establishment_fees,
                loan_service_fees: req.body.loan_service_fees,
                split_loan: req.body.split_loan,
                min_loan_amount: req.body.min_loan_amount,
                max_loan_amount: req.body.max_loan_amount,
                min_loan_term: req.body.min_loan_term,
                max_loan_term: req.body.max_loan_term,
                fees_url:req.body.fees_url
             }
        }
        OAODBHelper.updateProductFeatures(req.body.product_code,obj, function (result) {
            console.log("result in Feature Admin DB",result);
            res.json({data:"success"});
        });
    })
OAORouter.route('/setLocalContent')
    .post(function (req, res) {
        var file = './public/contents/Product1.json';
        var obj = req.body.newData;
        var err_v;
        jsonfile.writeFile(file, obj, function (err) {
            if (err) {
                console.log(err)
                err_v = err;
                res.json({ success: false });
            }
        });
        console.log("success")
        request.get(config.url.clientUrl + '/api/ChangeProductData/fetch')
            .on('response', function (response) {
                console.log(response.statusCode)
                console.log(response.headers['content-type'])
                res.json({ success: true });
            })
    });
var append = false;
var status = " "
OAORouter.get('/getStatusFileData', function (req, res) {
    // fs.readFile('./public/contents/productUpdateStatus.txt', 'utf8', (err, data) => {
    //     if (err) throw err;
    //     console.log(data);
    //     res.json({ result: data })
    // });
    if (status == "start") {
        res.json({ status: true })
    } else if (status == "stop") {
        res.json({ status: false })
    }

});
OAORouter.get('/resetFileData', function (req, res) {
    reset();
    res.json({ status: false })
});
function reset() {
    fs.writeFile('./public/contents/productUpdateStatus.txt', ' ', function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
        return;
    });
}

function log_body(body) {
    var pasteData = body
    substring = "Build started by";
    console.log(pasteData.includes(substring));
    if (!append) {
        append = true;
        status = "start";
    }
    if (pasteData.includes('Connected to Database') && append) {
        appendData(pasteData);
        appendData("\n Build Succeded you can now open app.");
        append = false;
        status = "stop";
    }

    if (append) {
        appendData(pasteData);
    }

}
function appendData(pasteData) {
    fs.appendFile('./public/contents/productUpdateStatus.txt', pasteData, function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!', pasteData);
    });
}
function log_headers(req, headers) {

    var interested = headers.reduce(function (str, key) {
        str += "\n" + key + ": " + req.get(key);
        return str;
    }, '');
    console.log("\n", interested, "\n");

}

function body_parser(req, res, next) {
    if (!req.is('application/logplex-1')) {
        res.send(500, 'invalid');
        return;
    }

    req.logplexLogs = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        req.logplexLogs += chunk;
    });
    req.on('end', next);
}

OAORouter.use(body_parser);

OAORouter.post('/logs', function (req, res) {
    //   log_headers(req, ['Host', 'Con' ,'Content-Type' ,'Logplex-Msg-Count' ,'Logplex-Frame-Id' ,'Logplex-Drain-Token' ,'User-Agent' ,'Content-Length' ,'Connection']);
    log_body(req.logplexLogs);
    res.send(201);
});


module.exports = OAORouter;