const express = require('express');
const router = express.Router();
var session = require('express-session');
let db;
var globalConfig = require('../config');

let dbInstance = require('../database/db').initDb;

router.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: {maxAge: 60000000}}));

router.get('/index', function (req, httpres) {
    httpres.header("Content-Type", "text/html;charset=utf-8");
    var menu_list = []
    dbInstance.getMenuList(function (err,data) {
        menu_list = data
        httpres.render("user_index",{menu_list:menu_list,login_status:getLoginStatus(req)});
        return false;
    })
})
router.get('/user_index', function (req, httpres) {
    httpres.header("Content-Type", "text/html;charset=utf-8");
    var menu_list = []
    dbInstance.getMenuList(function (err,data) {
        menu_list = data
        httpres.render("user_index",{menu_list:menu_list,login_status:getLoginStatus(req)});
        return false;
    })
})
router.get('/', function (req, httpres) {
    httpres.header("Content-Type", "text/html;charset=utf-8");
    var menu_list = []
    dbInstance.getMenuList(function (err,data) {
        menu_list = data
        httpres.render("user_index",{menu_list:menu_list,login_status:getLoginStatus(req)});
        return false;
    })
})

router.get('/checkout',loginAuth,function (req, httpres) {
    httpres.header("Content-Type", "text/html;charset=utf-8");
    dbInstance.getCartList(req.session.user_id,function (err,data) {
        if (JSON.stringify(data) == '[]' ) {
            httpres.render("user_checkout_empty",{login_status:getLoginStatus(req)});
        } else {
            dbInstance.getUserInfo(req.session.user_id,function (err,userinfo) {
                httpres.render("user_checkout",{result:data,userinfo:userinfo[0],login_status:getLoginStatus(req)});
                return false;
            })
        }
    })
})

router.post('/create_order',loginAuth,function (req,httpres) {
    let customer = req.body.customer;
    let address = req.body.address
    let phone =req.body.phone
    let email =req.body.email
    let creditCard =req.body.creditCard

    dbInstance.getCartList(req.session.user_id,function (err,data) {
        if (JSON.stringify(data) == '[]' ) {
            httpres.status = 200;
            httpres.json({
                "success" : false,
                "msg" : 'cart is empty',
                "data" : [],
                "code" : 0
            })
        } else {
            var cartAmount = 0;
            data.forEach(function (item,v) {
                console.log(item)
                cartAmount = cartAmount*1 + (item.food_qty*item.food_price).toFixed(2)*1
            })

            let obj = {
                order_status : 0,
                cart_info : JSON.stringify(data),
                shipping_fee : 0.2,
                coupon_fee : 0.1,
                cart_fee : cartAmount.toFixed(2),
                payment_amount : (cartAmount*1+0.2-0.1).toFixed(2),
                customer_id : req.session.user_id,
                receiver_name : customer,
                email : email,
                address : address,
                phone : phone,
                card_number : creditCard
            }
            dbInstance.createOrder(obj,function (err,data) {
                if (!err) {
                    dbInstance.clearCartList(req.session.user_id,function (err,data) {
                        if (!err) {
                            httpres.status = 200;
                            httpres.json({
                                "success" : true,
                                "msg" : 'create success',
                                "data" : [],
                                "code" : 0
                            })
                            return false;
                        }
                    })
                }
                httpres.status = 200;
                httpres.json({
                    "success" : false,
                    "msg" : 'error' + err.message,
                    "data" : [],
                    "code" : 0
                })
                return false;
            })
        }
    })
})

router.all('/user_register',function(req,httpres){

    if (req.method === 'GET') {
        httpres.header("Content-Type", "text/html;charset=utf-8");
        if (req.session.user_id) {
            httpres.render("user_index");
        } else {
            httpres.render("user_register");
        }
        return false;
    }

    let email = req.body.email || '';
    let password = req.body.password || '';
    let firstname = req.body.firstname || '';
    let lastname = req.body.lastname || '';
    let gender = req.body.gender || '';
    let birthday = req.body.birthday || '';
    let address = req.body.address || '';
    let address2 = req.body.address2 || '';
    let city = req.body.city || '';
    let state = req.body.state || '';
    let country = req.body.country || '';
    let phonenumber = req.body.phonenumber || '';
    let postcode = req.body.postcode || '';


    if(phonenumber == '' || password == '' || email == '' || firstname == '' || lastname == '') {
        httpres.status(200),
            httpres.json({
                "success" : false,
                "msg" : "username or password or email cannot be null"
            })
    }

    let obj = {
        email : email,
        password : password,
        firstname : firstname,
        lastname : lastname,
        gender : gender,
        birthday : birthday,
        address : address,
        address2 : address2,
        city : city,
        state : state,
        country : country,
        phonenumber : phonenumber,
        postcode : postcode,
    };

    dbInstance.check_user(obj,function (err,data) {
        console.log(JSON.stringify(data))
            if (JSON.stringify(data) == '[]') {
                dbInstance.user_register(obj,function (err,data) {
                    if (err == null) {
                        httpres.status = 200;
                        httpres.json({
                            "success" : true,
                            "msg" : 'register success',
                            "data" : [],
                            "code" : 0
                        })
                    } else {
                        httpres.status = 200;
                        httpres.json({
                            "success" : false,
                            "msg" : 'register fail' . err.message,
                            "data" : [],
                            "code" : 0
                        })
                    }
                })
            }  else {
                httpres.status = 200;
                httpres.json({
                    "success" : false,
                    "msg" : 'username has exist',
                    "data" : [],
                    "code" : 0
                })
            }
        })

});

router.all('/user_login',function(req,httpres){

    if (req.method === 'GET') {
        httpres.header("Content-Type", "text/html;charset=utf-8");
        if (req.session.user_id) {
            httpres.render("user_index");
        } else {
            httpres.render("user_login");
        }
        return false;
    }

    let username = req.body.username || '';
    let password = req.body.password || '';

    if(username == '' || password == '') {
        httpres.status(200),
            httpres.json({
                "success" : false,
                "msg" : "username or password cannot be null"
            })
    }

    let obj = {"username":username,"password":password};

    dbInstance.user_login(obj,function (err,data) {
        console.log(data);
        if (err == null) {
            if (JSON.stringify(data) == '[]') {
                httpres.status = 200;
                httpres.json({
                    "success" : false,
                    "msg" : 'login fail. username or password is invalid',
                    "data" : data,
                    "code" : 0
                })
            } else {
                req.session.user_id = data[0].id
                req.session.type = 1
                httpres.status = 200;
                httpres.json({
                    "success" : true,
                    "msg" : 'login success',
                    "data" : data,
                    "code" : 0
                })
            }
        } else {
            httpres.status = 200;
            httpres.json({
                "success" : false,
                "msg" : 'login fail' .err.message,
                "data" : [],
                "code" : 0
            })
        }
    })
});

router.post('/user_logout',function (req,httpres) {
    req.session.user_id = '';
    req.session.destroy(function(err) {
        if(err){
            httpres.status(200),
                httpres.json({
                "success" : false,
                "msg" : "logout failed",
            });
            return;
        } else {
            httpres.status(200),
                httpres.json({
                    "success" : true,
                    "msg" : "logout success",
                });
            return;
        }

    });
})

router.get('/cart_list', loginAuth, function (req,httpres) {
    let uid = req.session.user_id;
    dbInstance.getCartList(uid, function (err,data) {
        httpres.header("Content-Type", "text/html;charset=utf-8");
        httpres.render("user_cart",{result:data,login_status:getLoginStatus(req)});
        return false;
    })
})

router.post('/add_cart',loginAuth,function (req,httpres) {
    let uid = req.session.user_id;
    let params = req.body.data
    console.log(uid,'uid')
    dbInstance.addCartList(uid, params,function (err, data) {
        httpres.status(200),
            httpres.json({
                "success" : true,
                "status": 1,
                "data": null,
                "msg" : "add success"
            })
    })
})

router.post('/update_cart',loginAuth,function (req,httpres) {
    let uid = req.session.user_id;
    let params = req.body.data
    console.log(uid,'uid')
    console.log(params,'params')

    dbInstance.updateCartList(uid, params,function (err, data) {
        httpres.status(200),
            httpres.json({
                "success" : true,
                "status": 1,
                "data": null,
                "msg" : "update success"
            })
    })
})

router.post('/clear_cart',loginAuth,function (req,httpres) {
    let uid = req.session.user_id;
    console.log(uid,'uid')
    dbInstance.clearCartList(uid,function (err, data) {
        httpres.status(200),
            httpres.json({
                "success" : true,
                "status": 1,
                "data": null,
                "msg" : "clear success"
            })
    })
})


router.get('/profile',loginAuth,function (req,httpres) {
    if (req.method === 'GET') {
        dbInstance.getProfile(req.session.user_id,function (err,profileInfo) {
            dbInstance.getOrderList(req.session.user_id, function (err,data) {
                httpres.header("Content-Type", "text/html;charset=utf-8");
                console.log(profileInfo)
                httpres.render("user_profile",{result:data,profileInfo:profileInfo[0],login_status:getLoginStatus(req)});
                return false;
            })
        })

    }
})

router.post('/user_order_delete',loginAuth,function (req,httpres) {
    let uid = req.session.user_id
    let oid = req.body.oid
    dbInstance.userDelOrder(uid,oid,function (err,data) {
        httpres.status(200),
            httpres.json({
                "success" : true,
                "status": 1,
                "data": null,
                "msg" : "delete success"
            })
    })
})

router.post('/update_profile',loginAuth, function (httpreq,httpres) {
    dbInstance.updateProfile(httpreq.session.user_id,
        httpreq.body.email,
        httpreq.body.phonenumber,
        function (err,data) {
            httpres.status(200),
                httpres.json({
                    "success" : true,
                    "status": 1,
                    "data": null,
                    "msg" : "update success"
                })
    })
})

router.get('/add_comment',loginAuth,function (req,httpres) {
    httpres.header("Content-Type", "text/html;charset=utf-8");
    httpres.render("add_comment",{oid:req.query.oid,login_status:getLoginStatus(req)});
    return false;
})

router.post('/user_create_comment',loginAuth,function (req,httpres) {
    let content = req.body.content;
    let uid = req.session.user_id;
    let oid = req.body.oid
    let level_of_stars = req.body.level_of_stars
    let obj = {
        order_id : oid,
        content : content,
        customer_id : uid,
        level_of_stars : level_of_stars,
    }
    dbInstance.userCreateComment(obj,function (err,data) {
        httpres.status(200),
            httpres.json({
                "success" : true,
                "status": 1,
                "data": null,
                "msg" : "comment success"
            })
    })
})

router.get('/order_comment_list',function (req,httpres) {

})

function getLoginStatus(req) {
    if (req.session.user_id != undefined && req.session.user_id != '') {
        return 1
    } else {
        return 0
    }
}

function loginAuth(req,res,next)
{
    console.log(req.session.user_id,'session_uid');
    if (req.session.user_id != undefined && req.session.user_id != '' ) {
        return next()
    } else {
        var isAjaxRequest = req.xhr;
        if (isAjaxRequest) {
            res.status(200),
                res.json({
                    "success" : false,
                    "status": -1,
                    "data": null,
                    "msg" : "login first"
                })
        } else {
            res.header("Content-Type", "text/html;charset=utf-8");
            res.render("user_login");
            return false;
        }
    }
}

module.exports = router;