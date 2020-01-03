var express = require('express');
var router = express.Router();
var user = require('../model/user');
var ngo =require('../model/ngo');
var patheo = require('../model/pathology');
////////////////////////////////////////////////   home   //////////////////////////////////////////////////////
router.get('/',function(req,res){
	res.render('home');
	//res.send(req);
})

////////////////////////////////////////////////   login    /////////////////////////////////////////////////////
router.get('/login',function(req,res){
    res.render("login",{
        message : " " ,
        message2 : " "
    });
})
router.post('/login',function(req,res,next){
    user.auth(req.body.number,req.body.password,function(err,user,isMatch){
        if (err) {
            return next(err);
        }
        else if(!user){
            return res.render("login",{ message : "No such user",message2 : " " });
        } 
        else if(isMatch){
	    req.session.userId = user._id;
            return res.redirect('/profile');
        }
        else{
            return res.render("login",{ message : " ",message2 : "Wrong Password" });
        }
    })
})
///////////////////////////////////////////////   register   /////////////////////////////////////////////////////
router.get('/register',function(req,res){
    res.render("register",{
        message : " "
    });
})

router.post('/register',function(req,res,next){
    
    var USER= new user({
        name : req.body.name , 
        password : req.body.password ,
        address: req.body.address,
        mobile : req.body.number,
        email: req.body.email,
        bloodgrp: req.body.bloodg,
        dob : req.body.dob,
       // testAvail: {test: "test1",price: "350"}
    });
    // var arr = {
    //     test :"test2" , price : "351"
    //   }
    // USER.testAvail.push(arr)
    user.made(req.body.number,USER,function(err,User){
        if (err) {
            return next(err);
        }
        if(User){
	        req.session.userId = User._id;
            return res.render("register",{ message : "User Added Successfully" });	
        } 
        else{
            return res.render("register",{ message : "NUMBER already exist" });
        }
    })
    
})
////////////////////////////////////////////////// user profile  /////////////////////////////////////////////////////
// to check user logged in
router.get('/profile',function(req,res,next){
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(User===null)
            {
                return res.redirect('/login');
            }
            else{
                res.render("dashboard",{message:""});    
            }
        }
    })
})

router.get('/user', function(req, res) {
    //res.render('user');
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(User===null)
            {
                return res.redirect('/login');
            }
            else{
                return res.render("user",{message : ' '});
            }
        }
    })
});

router.post('/update', function(req, res,next ){
    user.findById(req.session.userId,function(err,USer){
        if(err)
        {
            return next(err);
        }
        else
        {
    console.log("update")
    var User={
        name : req.body.name , 
        password : req.body.password ,
        address: req.body.address,
        mobile : USer.mobile,
        email: USer.email,
        bloodgrp: req.body.bloodg,
    };
    if(User.name== ""){
        User.name=USer.name;
    }
    
    if(User.address==""){
        User.address=USer.address;
    }
    if(User.bloodgrp==""){
        User.bloodgrp=USer.bloodgrp;
    }
    if(User.password == ""){
        console.log(USer.password)
        User.password=USer.password;
        user.updateOne({_id: req.session.userId},User, function(err, docs){
            if(err) return next(err);
           else return  res.render("user",{message : "Updated Successfully"});
        });
        
    }
    else{
        user.hashing(User,function(err){
            if(err) return next(err);
            user.updateOne({_id: req.session.userId},User, function(err, docs){
                if(err) return next(err);
               else return  res.render("user",{message : "Updated Successfully"});
            });
        })
        
    }
    }
})
    //return  res.render("user",{message : "Updated Successfully"});
})

router.post('/updatep', function(req, res,next ){
    patheo.findById(req.session.userId,function(err,USer){
        if(err)
        {
            return next(err);
        }
        else
        {
    console.log("update")
    var User={
        name : req.body.name , 
        password : req.body.password ,
        address: req.body.address,
        mobile : USer.mobile,
        email: USer.email,
        testAvail : USer.testAvail,
        bloodTest :USer.bloodTest,
        bloodTestDone:USer.bloodTestDone

    };
    if(User.name== ""){
        User.name=USer.name;
    }
    if(User.address==""){
        User.address=USer.address;
    }
    if(User.password!= ""){
        patheo.hashing(User,function(err){
            if(err) return next(err);
             patheo.updateOne({_id: req.session.userId},User, function(err, docs){
                 if(err) return next(err);
                else return  res.render("p_profile",{message : "Updated Successfully"});
             });
         })
    }
    else{
        User.password=USer.password;
        patheo.updateOne({_id: req.session.userId},User, function(err, docs){
            if(err) return next(err);
           else return  res.render("p_profile",{message : "Updated Successfully"});
        });
    }
    }
})
    //return  res.render("user",{message : "Updated Successfully"});
})


//to render user data
router.get('/view',function(req,res,next){
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        return res.send(User);
    })
})

router.get('/viewp',function(req,res,next){
    patheo.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        return res.send(User);
    })
})

router.get('/logout',function(req,res,next){
    console.log("logout")
    if(req.session)
    {   
        console.log("logout1")
        req.session.destroy(function(err){
            if(err)
            {
                return next(err);
            }
            else{
                console.log("logout2")
                return res.redirect('/');
            }
        })
    }
})
///////////////////////// for pUser test req ////////////////////////////////////////////////////////////////
router.post('/bloodtest',function(req,res,next){
    patheo.find({_id: req.session.userId}, function(err, puser){
        if(err){
                return next(err);
        }
        if(puser==null){
                res.redirect('/p_login');
        }
        return res.send(puser.bloodTest);

    })
})


///////  to add user report
router.get('/report', function(req, res,next ){
    return res.redirect('/puser');
})

router.post('/report', function(req, res,next ){
    console.log("report")
    var User={
        reportLink : req.body.link
    };
    
        patheo.find({_id: req.session.userId}, function(err, puser){
            puser.bloodTest.find({srNo:req.body.srNo},function(err, patient){
                
            })
        });
    
	            
    //return  res.render("user",{message : "Updated Successfully"});
})

//to add remove view test for patheo user////////////////5d1f0b027e1ce23c0add072a/////////req.session.userId
router.get('/testpadd',function(req,res,next){
    return res.redirect('p_tests');    
    
})
router.post('/testpadd',function(req,res,next){
    var obj = {
        testType :req.body.test_name , price : req.body.price
      };
        patheo.findOne({ _id: req.session.userId }, function(err, Patheo) {
        if (err||!Patheo) return next(err); 
        if(Patheo){ 
            console.log(obj)
            Patheo.testAvail.push(obj)
            Patheo.save();
        //     patheo.update({
        //         { '_id': req.session.userId},
        //         {$push: {'testAvail': obj}}
        //     })
                 return  res.redirect('/p_tests');
          }
        });
})
router.post('/testpremove',function(req,res,next){
    
    patheo.update(
        {_id: req.session.userId},
        { $pull: { testAvail: { testType:req.body.test } } },function(){
            return res.send('1');
        }
      );    

})

router.post('/testpview',function(req,res,next){
    patheo.findOne({_id: req.session.userId},function(err,Patheo){
    if(err)
        {
            return next(err);
        }
        //console.log(Patheo.testAvail);
    return res.send(Patheo.testAvail);
    })
})

/////////////// New Get Additions on 5/7 //////////

router.get('/aboutus', function(req, res) {
    res.render('aboutus');
});

router.get('/ngo', function(req, res) {
    res.render('ngo');
});

router.get('/pathologies', function(req, res) {
    res.render('pathologies');
});

router.get('/contactus', function(req, res) {
    res.render('contactus');
});

router.get('/dashboard', function(req, res) {
    //res.render('dashboard');
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(User===null)
            {
                return res.redirect('/login');
            }
            else{
                return res.render('dashboard');
            }
        }
    })
});



router.get('/bloodtest', function(req, res) {
    //res.render('bloodtest');
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(User===null)
            {
                return res.redirect('/login');
            }
            else{
                return res.render('bloodtest');
            }
        }
    })
});

router.get('/donate', function(req, res) {
    //res.render('donate');
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(User===null)
            {
                return res.redirect('/login');
            }
            else{
                return res.render('donate');
            }
        }
    })
});

router.get('/p_dashboard', function(req, res) {
    //return res.render('p_dashboard');
    patheo.findById(req.session.userId,function(err,Patheo){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(Patheo===null)
            {
                return res.redirect('/p_login');
            }
            else{
                return res.render('p_dashboard');
            }
        }
    })
});

router.get('/p_profile', function(req, res) {
    //return res.render('p_profile');
    patheo.findById(req.session.userId,function(err,Patheo){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(Patheo===null)
            {
                return res.redirect('/p_login');
            }
            else{
                return res.render('p_profile',{message:""});
            }
        }
    })
});

router.get('/p_contactus', function(req, res) {
    //return res.render('p_contactus');
    patheo.findById(req.session.userId,function(err,Patheo){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(Patheo===null)
            {
                return res.redirect('/p_login');
            }
            else{
                return res.render('p_contactus');
            }
        }
    })
    
});

router.get('/p_requests', function(req, res) {
    //return res.render('p_requests');
    patheo.findById(req.session.userId,function(err,Patheo){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(Patheo===null)
            {
                return res.redirect('/p_login');
            }
            else{
                return res.render('p_requests');
            }
        }
    })
    
});

router.get('/p_tests', function(req, res) {
    //return res.render('p_tests');
    patheo.findById(req.session.userId,function(err,Patheo){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(Patheo===null)
            {
                return res.redirect('/p_login');
            }
            else{
                return res.render('p_tests');
            }
        }
    })
    //res.render('p_tests');
});

router.get('/p_history', function(req, res) {
    //return res.render('p_history');
    patheo.findById(req.session.userId,function(err,Patheo){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(Patheo===null)
            {
                return res.redirect('/p_login');
            }
            else{
                return res.render('p_history');
            }
        }
    })
    //res.render('p_history');
});
//////////////////////////////////////////////////////////////////////////////////////
router.get('/p_login',function(req,res){
    res.render("p_login",{
        message : " " ,
        message2 : " "
    });
})
router.post('/p_login',function(req,res,next){
    patheo.auth(req.body.number,req.body.password,function(err,user,isMatch){
        if (err) {
            return next(err);
        }
        else if(!user){
            return res.render("p_login",{ message : "No such user",message2 : " " });
        } 
        else if(isMatch){
	        req.session.userId = user._id;
            return res.redirect('/p_profile');
        }
        else{
            return res.render("p_login",{ message : " ",message2 : "Wrong Password" });
        }
    })
})

router.get('/p_register',function(req,res){
    res.render("p_register",{
        message : " "
    });
})

router.post('/p_register',function(req,res,next){
    console.log("ih")
    var USER= new patheo({
        name : req.body.name , 
        password : req.body.password ,
        address: req.body.address,
        mobile : req.body.number,
        email: req.body.email,
    });

    patheo.made(req.body.number,USER,function(err,User){
        if (err) {
            return next(err);
        }
        if(User){
	        req.session.userId = User._id;
            return res.render("p_register",{ message : "User Added Successfully" });	
        } 
        else{
            return res.render("p_register",{ message : "NUMBER already exist" });
        }
    })
    
})

router.post('/test_p_request',function(req,res,next){
    
    patheo.findOne({_id: req.session.userId},function(err,Patheo){
        if(err)
            {
                return next(err);
            }
        if(req.body.test_name===""){
            return res.send(Patheo.bloodTest);
        }
        else{
            var myTests=[];
            for(var i = Patheo.bloodTest.length -1; i >= 0 ; i--){
                if(Patheo.bloodTest[i].testType===req.body.test_name)
                myTests.push(Patheo.bloodTest[i]);
            }
            console.log(myTests,req.body.test_name)
            return res.send(myTests);
        }
        
        })
}) 

router.post('/test_p_history',function(req,res,next){
    patheo.findOne({_id: req.session.userId},function(err,Patheo){
        if(err)
        {
            return next(err);
        }
        if(req.body.test_name===""){
            return res.send(Patheo.bloodTestDone);
        }
        else{
            var myTests=[];
            for(var i = Patheo.bloodTestDone.length -1; i >= 0 ; i--){
                if(Patheo.bloodTestDone[i].testType===req.body.test_name)
                myTests.push(Patheo.bloodTestDone[i]);
            }
            console.log(myTests,req.body.test_name)
            return res.send(myTests);
        }
        //return res.send(Patheo.bloodTestDone);
        })
})

router.post('/reportSubmit',function(req,res,next){
            //patheo.update({_id:ObjectId("584a13d5b65761be678d4dd4")}, {$set: {"citiName":"Jakarta Pusat"}})
            patheo.update(
                {_id: req.session.userId,"bloodTest.testId":req.body.testId},
                { $set: { "bloodTest.$.reportLink": req.body.reportLink , "bloodTest.$.status": "done" } },function(){
                    //var p;
                    patheo.findOne({_id: req.session.userId},function(err,Patheo){
                        if(err)
                            {
                                return next(err);
                            }
                        else{
                            function search(nameKey, myArray){
                                for (var i=0; i < myArray.length; i++) {
                                    if (myArray[i].testId === nameKey) {
                                        return myArray[i];
                                    }
                                }
                            }
                            var resultObject = search(req.body.testId, Patheo.bloodTest);
                            Patheo.bloodTestDone.push(resultObject);
                            Patheo.bloodTest.pull(resultObject);
                            console.log(resultObject);
                            Patheo.save({},function(){
                                user.update({ "mobile":resultObject.number ,"history.bloodTest.testId":resultObject.testId },{"$set":{"history.bloodTest.$.status":"Done"}},function(err,x){
                                    if(err)
                                    {
                                        return next(err);
                                    }
                                    else{
                                        console.log(x);
                                        return res.send('1');
                                    }
                                })
                            });
                            //console.log("su")
                            
                        }
                        })
                    
                }
              );  
})
router.post('/showReport',function(req,res,next){
    patheo.findOne({_id:req.session.userId},function(err,Patheo){
        for(var i=0;i<=Patheo.bloodTestDone.length-1;i++){
            //console.log(Patheo.bloodTestDone[i].reportLink);
            console.log("room");
            if(Patheo.bloodTestDone[i].testId === req.body.testId){
                return res.send({reportLink : Patheo.bloodTestDone[i].reportLink });
            }
        }
        console.log("room");
        return res.send({reportLink:""});
    })
})

//////////////////////////////////geetam .//////////
router.get('/activity', function(req, res, next) {
    // return res.render('activity');
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(User===null)
            {
                 res.redirect('/login');
            }
            else{
                 res.render('activity');
            }
        }
    })
});
router.post('/activity',function(req,res,next){
    console.log("1");
    user.findById(req.session.userId,function(err,User){console.log("2");
        if(err)
        {
            return next(err);
        }
        else{
            if(User==null)
            {
                res.redirect('/login');
            }
            else
            {
                res.send(User.history);
            }
            // if(req.body.field=="bloodTest"){console.log(User.history.bloodTest);
            //     //console.log((User.history.bloodTest).toJSON);
            // return res.send(User.history.bloodTest);
            // }
            // else if(req.body.field=="bloodDonation"){
            //     return res.send(User.history.bloodDonation);
            // }
            // else{
            //     return res.send(User.history.bloodRequest);
            // }
        }
    })
})

router.post("/addTest",function(req,res,next){
    console.log(req.body.testType,req.body.pathology)
    var Length=100;
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(User==null)
            {
                res.redirect('/login');
            }
            else
            {
                patheo.findOne({name:req.body.pathology},function(err,pathology){
                    Length=pathology.bloodTest.length+pathology.bloodTestDone.length;
                    patheo.update(
                        { "name": req.body.pathology},
                        { $push: { "bloodTest": {testId:(Length+1).toString(),name:User.name,number:User.mobile,time:req.body.scheduledTime,testType:req.body.testType,status:"Pending",reportLink:""} }},
                        function(err,x)
                        {
                            if(err)
                            {
                                console.log(err);
                            }
                            else{
                                console.log(x);
                            }
                        }
                      );
                      user.update(
                        { "_id": User._id},
                        { $push: { "history.bloodTest": {time:req.body.scheduledTime,pathology:req.body.pathology,testType:req.body.testType,testId:(Length+1).toString(),status:"Pending"} }},
                        function(err,x)
                            {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else{
                                    console.log(x);
                                }
                            }
                      );
                });
                res.send("1");  
            }
        }
    })
})

router.post("/fetchReport",function(req,res,next){
    patheo.findOne({name:req.body.pathology},function(err,pathology){
        if(err)
        {
            return next(err);
        }
        else
        {
            const test=pathology.bloodTestDone.find(function (test) { 
                return test.testId === req.body.testId;
            })
            console.log(test);
            
            if(test){
                // //yash
                // user.findOne({_id:req.session.userId},function(err,User){
                //     for(var i=0;i<User.history.bloodTest.length;i++){
                //         if(User.history.bloodTest[i].testId===req.body.testId){
                //             User.history.bloodTest[i].status="Done"
                //         }
                //     }
                // })
                // //yash
                return res.send({reportLink:test.reportLink});
            }
            else{
                return res.send({reportLink:""});
            }
        }
    })
})
router.get('/addBloodTest',function(req,res,next){
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(User===null)
            {
                res.redirect('/login');
            }
            else
            {
                res.render("bloodtest");
            }
        }
    })
})
router.post('/searchTest',function(req,res,next){
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(User===null)
            {
                res.redirect('/login');
            }
            else
            {
                if(req.body.pathology!=="")
                {
                    patheo.findOne({name:req.body.pathology},function(err,Pathology){
                        if(err)
                        {
                            return next(err);
                        }
                        else
                        {
                            var myTests=[];
                            for(var i = Pathology.testAvail.length -1; i >= 0 ; i--){
                                if(req.body.testType!==""&&(Pathology.testAvail[i]).testType !==req.body.testType){
                                    continue;
                                }
                                myTests.push({pathology:req.body.pathology,testType:(Pathology.testAvail[i]).testType,price:(Pathology.testAvail[i]).price})
                            }
                            console.log(myTests)
                            return res.send(myTests);
                        }
                    })
                }
                else 
                {
                    //console.log(patheo.find());
                    patheo.find({},function(err,pathologies){
                        var myTests=[];
                        pathologies.forEach(function(Pathology){
                            for(var i = 0; i <= Pathology.testAvail.length -1 ; i++){
                                if(req.body.testType!==""&&(Pathology.testAvail[i]).testType !==req.body.testType){
                                    continue;
                                }
                                
                                myTests.push({pathology:Pathology.name,testType:(Pathology.testAvail[i]).testType,price:(Pathology.testAvail[i]).price});
                                console.log(myTests);
                            }
                        })
                        return res.send(myTests);
                    });
                }
                
            }
            
        }
    })
})

/////////////////////////////////////////////NGONGONGONGOGNGOGNGONGGN
router.get('/n_login',function(req,res){
    res.render("n_login",{
        message : " " ,
        message2 : " "
    });
})
router.post('/n_login',function(req,res,next){
    ngo.auth(req.body.number,req.body.password,function(err,ngo,isMatch){
        if (err) {
            return next(err);
        }
        else if(!ngo){
            return res.render("n_login",{ message : "No such user",message2 : " " });
        } 
        else if(isMatch){
	    req.session.userId = ngo._id;
            return res.redirect('/n_profile');
        }
        else{
            return res.render("n_login",{ message : " ",message2 : "Wrong Password" });
        }
    })
})

router.get('/n_register',function(req,res){
    res.render("n_register",{
        message : " "
    });
})

router.post('/n_register',function(req,res,next){
    
    var USER= new ngo({
        name : req.body.name , 
        password : req.body.password ,
        address: req.body.address,
        mobile : req.body.number,
        email: req.body.email,

    });

    ngo.made(req.body.number,USER,function(err,User){
        if (err) {
            return next(err);
        }
        if(User){
	        req.session.userId = User._id;
            return res.render("n_register",{ message : "User Added Successfully" });	
        } 
        else{
            return res.render("n_register",{ message : "NUMBER already exist" });
        }
    })
    
})

router.get('/n_dashboard', function(req, res) {
    //return res.render('n_dashboard');
    ngo.findById(req.session.userId,function(err,Ngo){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(Ngo===null)
            {
                return res.redirect('/n_login');
            }
            else{
                return res.render('n_dashboard');
            }
        }
    })
});
router.get('/n_profile', function(req, res) {
    //return res.render('p_profile');
    ngo.findById(req.session.userId,function(err,Ngo){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(Ngo===null)
            {
                return res.redirect('/n_login');
            }
            else{
                return res.render('n_profile',{message:""});
            }
        }
    })
});


router.get('/n_history', function(req, res) {
    //return res.render('n_history');
    ngo.findById(req.session.userId,function(err,Ngo){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(Ngo===null)
            {
                return res.redirect('/n_login');
            }
            else{
                return res.render('n_history');
            }
        }
    })
    //res.render('n_history');
});


router.post('/n_collection_history',function(req,res,next){
    ngo.findOne({_id: req.session.userId},function(err,Ngo){
        if(err)
        {
            return next(err);
        }
        return res.send(Ngo.bloodDonationDone);
        //return res.send(Ngo.bloodDonationDone);
        })
})

router.post('/n_request_history',function(req,res,next){
    ngo.findOne({_id: req.session.userId},function(err,Ngo){
        if(err)
        {
            return next(err);
        }
        return res.send(Ngo.bloodRequestDone);
        //return res.send(Ngo.bloodDonationDone);
        })
})

router.post('/showCertificate',function(req,res,next){
    ngo.findOne({_id:req.session.userId},function(err,Ngo){
        for(var i=0;i<=Ngo.bloodDonationDone.length-1;i++){
            //console.log(Ngo.bloodDonationDone[i].certificateLink);
            console.log(Ngo.bloodDonationDone[i].donationId,req.body.donationId);
            if(Ngo.bloodDonationDone[i].donationId == req.body.donationId){
                console.log(Ngo.bloodDonationDone[i].certificateLink)
                return res.send({certificateLink : Ngo.bloodDonationDone[i].certificateLink });
            }
        }
        console.log("room2");
        return res.send({certificateLink:""});
    })
})


router.get('/n_collection', function(req, res) {
    //return res.render('n_collection');
    ngo.findById(req.session.userId,function(err,Ngo){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(Ngo===null)
            {
                return res.redirect('/n_login');
            }
            else{
                return res.render('n_collection');
            }
        }
    })
    
});

router.post('/n_collection',function(req,res,next){
    //console.log("hi")
    ngo.findOne({_id: req.session.userId},function(err,Ngo){
        if(err){
            console.log("he")
            return next(err);
        }
        //console.log(Ngo)
        return res.send(Ngo.bloodDonation);
        
    })
})

router.post('/certiSubmit',function(req,res,next){
    ngo.update(
        {_id: req.session.userId,"bloodDonation.donationId":req.body.donationId},
        { $set: { "bloodDonation.$.certificateLink": req.body.certificateLink  } },function(){

            ngo.findOne({_id: req.session.userId},function(err,Ngo){
                if(err)
                    {
                        return next(err);
                    }
                else{
                    function search(nameKey, myArray){
                        for (var i=0; i < myArray.length; i++) {
                            if (myArray[i].donationId === nameKey) {
                                return myArray[i];
                            }
                        }
                    }
                    var resultObject = search(req.body.donationId, Ngo.bloodDonation);
                    Ngo.bloodDonationDone.push(resultObject);
                    Ngo.bloodDonation.pull(resultObject);
                    Ngo.save();
                    //console.log("su")
                    return res.send('1');
                }
            })
        }
      );  
})

router.post('/n_request_work', function(req, res) {
    if(req.body.condition == "accept"){
        ngo.findOne({_id: req.session.userId},function(err,Ngo){
            if(err)
                {
                    return next(err);
                }
            else{

                function search(nameKey, myArray){
                    for (var i=0; i < myArray.length; i++) {
                        if (myArray[i].requestId === nameKey) {
                            return myArray[i];
                        }
                    }
                }
                var resultObject = search(req.body.requestId, Ngo.bloodRequest);
                Ngo.bloodRequestDone.push(resultObject);
                Ngo.bloodRequest.pull(resultObject);
                Ngo.save({},function(){
                    user.update({ mobile:req.body.number ,"history.bloodRequest.requestId":req.body.requestId },{$set:{"history.bloodRequest.$.status":"Done","history.bloodRequest.$.ngo":Ngo.name}},function(err){
                        if(err)
                        {
                            return next(err);
                        }
                        else{
                            ngo.find({},function(err,Ngos){
                                for(var i=0;i<=Ngos.length-1;i++){
                                    for(var j=0;j<=Ngos[i].bloodRequest.length-1;j++){
                                        if(Ngos[i].bloodRequest[j].requestId==req.body.requestId){
                                            Ngos[i].bloodRequest.pull(Ngos[i].bloodRequest[j]);
                                            Ngos[i].save();
                                            break;
                                        }
                                    }
                                }
                            return res.send("1");
                            })
                        }
                    })
                });
            }
        })

    }
    else{
        ngo.findOne({_id: req.session.userId},function(err,Ngo){
            console.log("su1")
            if(err)
                {
                    return next(err);
                }
            else{
                console.log("su2")
                function search(nameKey, myArray){
                    for (var i=0; i < myArray.length; i++) {
                        if (myArray[i].requestId === nameKey) {
                            return myArray[i];
                        }
                    }
                }
                var resultObject = search(req.body.requestId, Ngo.bloodRequest);
                Ngo.bloodRequest.pull(resultObject);
                Ngo.save();
                console.log("su")
                return res.send('1');
            }
        })
    }
});

router.get('/n_donation', function(req, res) {
    //return res.render('n_donation');
    ngo.findById(req.session.userId,function(err,Ngo){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(Ngo===null)
            {
                return res.redirect('/n_login');
            }
            else{
                return res.render('n_donation');
            }
        }
    })
    //res.render('n_donation');
});

router.post('/n_request',function(req,res,next){
    ngo.findOne({_id: req.session.userId},function(err,Ngo){
        if(err)
        {
            return next(err);
        }
        return res.send(Ngo.bloodRequest);
        //return res.send(Ngo.bloodDonationDone);
        })
})

router.get('/n_contactus', function(req, res) {
    //return res.render('n_contactus');
    ngo.findById(req.session.userId,function(err,Ngo){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(Ngo===null)
            {
                return res.redirect('/n_login');
            }
            else{
                return res.render('n_contactus');
            }
        }
    })
    
});

router.post('/updaten', function(req, res,next ){
    ngo.findById(req.session.userId,function(err,USer){
        if(err)
        {
            return next(err);
        }
        else
        {
    console.log("update")
    var User={
        name : req.body.name , 
        password : req.body.password ,
        address: req.body.address,
        mobile : USer.mobile,
        email: USer.email,
        bloodDonation:USer.bloodDonation,
        bloodDonationDone:USer.bloodDonationDone,
        bloodRequest:USer.bloodRequest,
        bloodRequestDone:USer.bloodRequestDone

    };
    if(User.address==""){
        User.address=USer.address;
    }
    if(User.name== ""){
        User.name=USer.name;
    }
    if(User.password!= ""){
        ngo.hashing(User,function(err){
            if(err) return next(err);
             ngo.updateOne({_id: req.session.userId},User, function(err, docs){
                 if(err) return next(err);
                else return  res.render("n_profile",{message : "Updated Successfully"});
             });
         })
    }
    else{
        User.password=USer.password;
        ngo.updateOne({_id: req.session.userId},User, function(err, docs){
            if(err) return next(err);
           else return  res.render("n_profile",{message : "Updated Successfully"});
        });
    }
    
    
    }
})
    //return  res.render("user",{message : "Updated Successfully"});
})

router.get('/viewn',function(req,res,next){
    ngo.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        return res.send(User);
    })
})

//////////////////////////////////////////////////////             NGO donation method routes
router.get('/request', function(req, res) {
    //res.render('request');
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(User===null)
            {
                return res.redirect('/login');
            }
            else{
                return res.render('request');
            }
        }
    })
});


 
router.post('/addDonation',function(req,res,next){
    //console.log(req.body.testType,req.body.pathology)
    var Length=100;
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(User==null)
            {
                res.redirect('/login');
            }
            else
            {
                ngo.findOne({name:req.body.ngo},function(err,NGO){
                    Length=NGO.bloodDonation.length+NGO.bloodDonationDone.length;
                    ngo.update(
                        { "name": req.body.ngo},
                        { $push: { "bloodDonation": {time:new Date,scheduledDate:req.body.date,name:User.name,quantity:req.body.quantity,bloodGroup:req.body.bloodGroup,number:User.mobile,address:User.address,certificateLink:"",donationId:(Length+1).toString()} }},
                        function(err,x)
                        {
                            if(err)
                            {
                                console.log(err);
                            }
                            else{
                                console.log(x);
                            }
                        }
                      );
                      user.update(
                        { "_id": User._id},
                        { $push: { "history.bloodDonation": {time:new Date(),ngo:req.body.ngo,quantity:req.body.quantity,bloodGroup:req.body.bloodGroup,scheduledDate:req.body.date,donationId:(Length+1).toString()} }},
                        function(err,x)
                            {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else{
                                    console.log(x);
                                }
                            }
                      );
                });
                res.send("1");  
            }
        }
    })
});

router.post("/fetchCertificate",function(req,res,next){
    console.log("req.body.ngo");
    ngo.findOne({name:req.body.ngo},function(err,NGO){
        if(err)
        {
            return next(err);
        }
        else
        {
            const donation=NGO.bloodDonationDone.find(function (donation) { 
                return donation.donationId === req.body.donationId;
            })
            //console.log(req.body.donationId);
            if(donation){
                return res.send({certificateLink:donation.certificateLink});
            }
            else{
                return res.send({certificateLink:""});
            }
        }
    })
})
/////////////////////////////////////////////////////////////////  Ngo request route methods
router.post('/addRequest',function(req,res,next){
    //console.log(req.body.testType,req.body.pathology)
    var Length=100;
    user.findById(req.session.userId,function(err,User){
        if(err)
        {
            return next(err);
        }
        else
        {
            if(User==null)
            {
                res.redirect('/login');
            }
            else
            {
                const randnumber=Math.floor((Math.random() * 100000000) + 1);
                ngo.find({},function(err,ngos){
                    ngos.forEach(function(NGO){
                        ngo.update(
                            { "name": NGO.name},
                            { $push: { "bloodRequest": {time:new Date(),deadline:req.body.deadline,name:User.name,quantity:req.body.quantity,bloodGroup:req.body.bloodGroup,number:User.mobile,address:req.body.address,requestId:randnumber} }},
                            function(err,x)
                            {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else{
                                    console.log(x);
                                }
                            }
                          );
                    })
                });
                user.update(
                    { "_id": User._id},
                    { $push: { "history.bloodRequest": {time:new Date(),ngo:"",quantity:req.body.quantity,deadline:req.body.deadline,bloodGroup:req.body.bloodGroup,status:"Pending",requestId:randnumber} }},
                    function(err,x)
                        {
                            if(err)
                            {
                                console.log(err);
                                }
                            else{
                                console.log(x);
                            }
                        }
                  );
                res.send("1");  
            }
        }
    })
});







module.exports = router;

//added message box in login page
// line 213
// yash change line 87 and also change p_* router security
// right top button of p_* are wrongly directed