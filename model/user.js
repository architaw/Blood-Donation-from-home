const bcrypt = require('bcrypt');
var mongoose=require('mongoose');
var testSchema1= new mongoose.Schema({time:String,pathology:String,testType:String,testId:String,status:String,scheduledTime:String});
var testSchema2= new mongoose.Schema({time:String,ngo:String,quantity:String,bloodGroup:String,scheduledDate:String,donationId:String});
var testSchema3= new mongoose.Schema({time:String,deadline:String,ngo:String,quantity:String,bloodGroup:String,status:String,requestId:String});
var userSchema = new mongoose.Schema({
    name : String,
    password : String,
    gender:String,
    address: String,
    mobile : { type: String, index: { unique: true } },
    email:String,
    bloodgrp: String,
    dob :String,
    history:{
      // bloodTest:Array({date:String,time:String,pathology:String,type:String,reportLink:String}),
      bloodTest:[testSchema1],
      bloodDonation:[testSchema2],
      bloodRequest:[testSchema3]
    }
});  
 
userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
});

userSchema.statics.hashing = function(user,callback){
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return callback(err);
    }
    user.password = hash;
    return callback();
  })
}

userSchema.statics.auth = function (number, password, callback){
    user.findOne({ mobile: number }, function(err, user) {
        if (err) return callback(err);
        else if(!user){
            return callback(null);
        }
        else{
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) {
                    return callback(err);
                }
                else{
                    return callback(null,user,isMatch);
                }
            })
        }
    })
}

userSchema.statics.made = function (number,USER,callback){
  user.findOne({ mobile: number }, function(err, user) {
    if (err) return callback(err); 
    if(!user){
        USER.save(function(err,user){
          if (err) return callback(err); 
          return callback(null,user);
        })	
    } 
    else{
      return callback(null,null);
    }
});
}

// userSchema.statics.findUserByBlood = function(BloodType,callback){
//   user.find({ bloodgrp:BloodType }, function(err, user) {
//     if (err) return callback(err); 
//     return callback(null,user);
//   });  
// }



var user=mongoose.model('user',userSchema);
module.exports = user;
