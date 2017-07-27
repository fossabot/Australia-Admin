var express = require('express');
var fs = require('fs');
var unzipper = require('unzipper');
var targz = require('targz');
var fs = require('fs');

var OAOPropertyDetail = require('../models/OAOPropertyDetailSchema');
var OAOProductTypeDetail = require('../models/OAOProductTypeSchema');
var OAODBHelper = require("./OAODBHelper");
var config_urls = require("../configFiles/DBconfigfile");


var herokuDeploy = require('heroku-deploy');
var OAODBHelper = require("./OAODBHelper");
var OAOPushToServerRouter = express.Router();

OAOPushToServerRouter.route('/testService')
    .get(function(req, res) {
        fs.readdir('/app/public/template', (err, files) => {
            files.forEach(file => {
                console.log(file);
                //res.json(file);

            });
        })


    })

OAOPushToServerRouter.route('/switchToTheme')
    .get(function(req, res) {
        var array = [];
        fs.readdir('/app/public/tarApplication', (err, files) => {
            files.forEach(file => {
                array.push(file);
            });
            res.json(array);
        })
    })

OAOPushToServerRouter.route('/subscribedTheme')
    .get(function(req, res) {
        OAOProductTypeDetail.find({ category: 'ux-theme' }, function(err, result) {
            // res.json({ Record: result })
            if (!result || result == '') {
                res.json({ Record: 'No Theme for subscriber' })
            } else {
                var themeName = [];

                result.forEach(records => {
                    themeName.push(records.product_type_name);
                })
                res.json({ Result: themeName })

            }


        })

    })




OAOPushToServerRouter.route('/extractUploadedFile/:filename')
    .get(function(req, res) {
        var Filename = req.params.filename;
        var CompressedApplication = Filename.split('.');
        var tarFilename = CompressedApplication[0];
        // 

        OAOPropertyDetail.find({ property: "CURRENT_UXTHEME" }, function(err, result) {
            // console.log(result);
            result[0].property_value = tarFilename;
            result[0].save(function(result) {
                if (result == null) {
                    fs.createReadStream('/app/public/template/' + Filename)
                        .pipe(unzipper.Extract({ path: '/app/public/templateToPush' }))
                        .on('close', function() {
                            console.log('heroku path', process.cwd());
                            targz.compress({
                                src: '/app/public/templateToPush',
                                dest: '/app/public/tarApplication/' + tarFilename + '.tar.gz'
                            }, function(err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    // herokuDeploy('13792193-713e-4887-87e0-fbc354b92d30', 'sntempoweronboard', '2.9', '/app/SampleApp/SampleApp.tar.gz').
                                    herokuDeploy('13792193-713e-4887-87e0-fbc354b92d30', 'sntempoweronboard', '2.27', '/app/public/tarApplication/' + tarFilename + '.tar.gz').
                                    then(function(response) {
                                        // res.send('Build request successfully submitted.');
                                        res.json("successfully Deployed... visit: https://sntempoweronboard.herokuapp.com");
                                    }).
                                    catch(function(err) {
                                        console.log(err);
                                        throw new Error('A heroku deployment error has occurred.');
                                    });
                                }
                            })
                        });
                }
            })
        })

    })

// New Plan for theme upload
// 
OAOPushToServerRouter.route('/publishTheme/:themeName')
    .get(function(req, res) {
        var Filename = req.params.themeName;

        OAOPropertyDetail.find({ property: "CURRENT_UXTHEME" }, function(err, result) {
            result[0].property_value = Filename;
            console.log("..........started................");
            result[0].save(function(result) {
                console.log("going to db");
                if (result == null) {
                    res.json("successfully Deployed... visit: https://sntempoweronboard.herokuapp.com");
                    // herokuDeploy('13792193-713e-4887-87e0-fbc354b92d30', 'sntempoweronboard', '2.27', 'C:\\Users\\Shubham Jain\\Latitude Fintech\\OneDrive - Latitude Fintech\\shubham-admin\\empower-admin\\public\\tarApplication\\' + Filename + '.tar.gz').
                    // then(function(response) {
                    //     res.json("successfully Deployed... visit: https://sntempoweronboard.herokuapp.com");
                    // }).
                    // catch(function(err) {
                    //     console.log(err);
                    //     throw new Error('A heroku deployment error has occurred.');
                    // });
                }
            })
        })
    })


OAOPushToServerRouter.route('/MarketPlaceProductDetails')
    .post(function(req, res) {
        var Details = req.body;
        var j = -1;
        var k = -1;
        var l = -1;
        OAOProductTypeDetail.find(function(err, result) {
            if (!result || result == '') {
                console.log("first");
                for (var i = 0; i < Details.product.length; i++) {
                    //console.log(Details.product[i]);

                    OAODBHelper.getProductTypeContent(Details.product[i], (result) => {
                        if (result) {
                            j += 1;
                            console.log(j);
                            var OAOProductTypeDetail_v = new OAOProductTypeDetail({
                                product_type_code: Details.product[j],
                                product_type_name: Details.desc_prod[j],
                                category: 'product',
                                country_code: config_urls.country
                            });
                            console.log(OAOProductTypeDetail_v);

                            OAOProductTypeDetail.find({ product_type_code: Details.product[j] }, function(err, result) {
                                if (!result || result == '') {
                                    console.log("inside insert");
                                    console.log(OAOProductTypeDetail_v);
                                    OAOProductTypeDetail_v.save(function(err, result) {
                                        // console.log(OAOProductTypeDetail_v);
                                        console.log(result);
                                    })

                                }

                            })
                        }
                    })


                }

                // UX theme
                for (var i = 0; i < Details.theme.length; i++) {
                    //console.log(Details.theme[i]);

                    OAODBHelper.getProductTypeContent(Details.theme[i], (result) => {
                        if (result) {
                            k += 1;
                            console.log(k);
                            var OAOProductTypeDetail_v = new OAOProductTypeDetail({
                                product_type_code: Details.theme[k],
                                product_type_name: Details.desc_theme[k],
                                category: 'ux-theme',
                                country_code: config_urls.country
                            });
                            console.log(OAOProductTypeDetail_v);

                            OAOProductTypeDetail.find({ product_type_code: Details.theme[k] }, function(err, result) {
                                if (!result || result == '') {
                                    console.log("inside insert");
                                    console.log(OAOProductTypeDetail_v);
                                    OAOProductTypeDetail_v.save(function(err, result) {
                                        // console.log(OAOProductTypeDetail_v);
                                        console.log(result);
                                    })

                                }

                            })
                        }
                    })


                }


                // For Add Ons

                for (var i = 0; i < Details.add_ons.length; i++) {
                    //console.log(Details.theme[i]);

                    OAODBHelper.getProductTypeContent(Details.add_ons[i], (result) => {
                        if (result) {
                            l += 1;
                            console.log(l);
                            var OAOProductTypeDetail_v = new OAOProductTypeDetail({
                                product_type_code: Details.add_ons[l],
                                product_type_name: Details.desc_add_ons[l],
                                category: 'add-on',
                                country_code: config_urls.country
                            });
                            console.log(OAOProductTypeDetail_v);

                            OAOProductTypeDetail.find({ product_type_code: Details.add_ons[l] }, function(err, result) {
                                if (!result || result == '') {
                                    console.log("inside insert");
                                    console.log(OAOProductTypeDetail_v);
                                    OAOProductTypeDetail_v.save(function(err, result) {
                                        // console.log(OAOProductTypeDetail_v);
                                        console.log(result);
                                    })

                                }

                            })
                        }
                    })


                }

                OAOPropertyDetail.find({ property: "CURRENT_UXTHEME" }, function(err, result) {
                    result[0].property_value = 'EmpowerDefault';
                    result[0].save(function(result) {
                        if (result == null) {
                            herokuDeploy('13792193-713e-4887-87e0-fbc354b92d30', 'sntempoweronboard', '2.27', '/app/public/tarApplication/default.tar.gz').
                            then(function(response) {
                                 OAODBHelper.SendMail(Details.email, Details);
                                res.json({Result:"successfully Deployed"});
                            }).
                            catch(function(err) {
                                console.log(err);
                                throw new Error('A heroku deployment error has occurred.');
                            });
                        }
                    })
                })

            } else {

                console.log("second time");
                for (var i = 0; i < Details.product.length; i++) {
                    //console.log(Details.product[i]);

                    OAODBHelper.getProductTypeContent(Details.product[i], (result) => {
                        if (result) {
                            j += 1;
                            console.log(j);
                            var OAOProductTypeDetail_v = new OAOProductTypeDetail({
                                product_type_code: Details.product[j],
                                product_type_name: Details.desc_prod[j],
                                category: 'product',
                                country_code: config_urls.country
                            });
                            console.log(OAOProductTypeDetail_v);

                            OAOProductTypeDetail.find({ product_type_code: Details.product[j] }, function(err, result) {
                                if (!result || result == '') {
                                    console.log("inside insert");
                                    console.log(OAOProductTypeDetail_v);
                                    OAOProductTypeDetail_v.save(function(err, result) {
                                        // console.log(OAOProductTypeDetail_v);
                                        console.log(result);
                                    })

                                }

                            })
                        }
                    })


                }

                // UX theme
                for (var i = 0; i < Details.theme.length; i++) {
                    //console.log(Details.theme[i]);

                    OAODBHelper.getProductTypeContent(Details.theme[i], (result) => {
                        if (result) {
                            k += 1;
                            console.log(k);
                            var OAOProductTypeDetail_v = new OAOProductTypeDetail({
                                product_type_code: Details.theme[k],
                                product_type_name: Details.desc_theme[k],
                                category: 'ux-theme',
                                country_code: config_urls.country
                            });
                            console.log(OAOProductTypeDetail_v);

                            OAOProductTypeDetail.find({ product_type_code: Details.theme[k] }, function(err, result) {
                                if (!result || result == '') {
                                    console.log("inside insert");
                                    console.log(OAOProductTypeDetail_v);
                                    OAOProductTypeDetail_v.save(function(err, result) {
                                        // console.log(OAOProductTypeDetail_v);
                                        console.log(result);
                                    })

                                }

                            })
                        }
                    })


                }


                // For Add Ons

                for (var i = 0; i < Details.add_ons.length; i++) {
                    //console.log(Details.theme[i]);

                    OAODBHelper.getProductTypeContent(Details.add_ons[i], (result) => {
                        if (result) {
                            l += 1;
                            console.log(l);
                            var OAOProductTypeDetail_v = new OAOProductTypeDetail({
                                product_type_code: Details.add_ons[l],
                                product_type_name: Details.desc_add_ons[l],
                                category: 'add-on',
                                country_code: config_urls.country
                            });
                            console.log(OAOProductTypeDetail_v);

                            OAOProductTypeDetail.find({ product_type_code: Details.add_ons[l] }, function(err, result) {
                                if (!result || result == '') {
                                    console.log("inside insert");
                                    console.log(OAOProductTypeDetail_v);
                                    OAOProductTypeDetail_v.save(function(err, result) {
                                        // console.log(OAOProductTypeDetail_v);
                                        console.log(result);
                                    })

                                }

                            })
                        }
                    })


                }
				
				res.json("successfully Deployed...");

            }
        })





    }),

    OAOPushToServerRouter.route('/PropertyDetails/:PropertyType/:Property')
        .get(function (req, res) {
            console.log(req.params.PropertyType);
            console.log(req.params.Property)
            var PropertyType = req.params.PropertyType;
            var Property = req.params.Property;
            OAODBHelper.getDropboxContent(PropertyType, Property, function (result) {
                console.log(result);
                res.json({ result: result });
            })
        });

module.exports = OAOPushToServerRouter;