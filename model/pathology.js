const bcrypt = require('bcrypt');
var mongoose=require('mongoose');

var testSchema1 = new mongoose.Schema({testType :String , price : String });
var testSchema2 = new mongoose.Schema({testId:String , name :String , number : String , time :String ,testType :String  ,reportLink:String, status:String });


var patheoSchema = new mongoose.Schema({
    name : String,
    address: String,
    password : String,
    email : String,
    mobile : { type: String, index: { unique: true } },
    testAvail : [testSchema1],   //Array({test :String , prize : String }) // [{test :String , prize : String }]
    bloodTest :[testSchema2],
    bloodTestDone:[testSchema2]
});


// patheoSchema.pre('save', function (next) {
//   var patheo = this;
//   bcrypt.hash(patheo.password, 10, function (err, hash){
//     if (err) {
//       return next(err);
//     }
//     patheo.password = hash;
//     next();
//   })
// });
  
patheoSchema.statics.hashing = function(user,callback){
  // bcrypt.hash(user.password, 10, function (err, hash){
  //   if (err) {
  //     return callback(err);
  //   }
  //   user.password = hash;
    return callback();
  // })
}


patheoSchema.statics.auth = function (number, password, callback){
  patheo.findOne({ mobile: number }, function(err, Patheo) {
      if (err) return callback(err);
      else if(!Patheo){
          return callback(null);
      }
      else{
          // bcrypt.compare(password, Patheo.password, function(err, isMatch) {
          //     if (err) {
          //         return callback(err);
          //     } 
          //     else{
          //         return callback(null,Patheo,isMatch);
          //     }
          // })
          if(password===Patheo.password){
            return callback(null,Patheo,true);
          }
          else{
            return callback(null,Patheo,false);
          }
      }
  })
}

patheoSchema.statics.made = function (number,Patheo,callback){
//   patheo.findOne({ mobile: number }, function(err, PAtheo) {
//     if (err) return callback(err); 
//     if(!PAtheo){
//         patheo.create(Patheo,function(err,patheo){
//           if (err) return callback(err); 

//           return callback(null,patheo);
            
//         })	
        
//     } 
//     else{
//       return callback(null,null);
//     }
// });
patheo.findOne({ mobile: number }, function(err, PAtheo) {
  if (err) return callback(err); 
  if(!PAtheo){
      Patheo.save(function(err,patheo){
        if (err) return callback(err); 

        return callback(null,patheo);
          
      })	
      
  } 
  else{
    return callback(null,null);
  }
  
});
}

patheoSchema.statics.findpathologyByCity = function(city,callback){
    patheo.find({ city :city }, function(err, patheo) {
      if (err) return callback(err); 
      return callback(null,patheo);
    });
}

patheoSchema.statics.findPathologyByTest = function(test,callback){
  patheo.find({ "testAvail.testType" : test }, function(err, patheo) {
    if (err) return callback(err); 
    return callback(null,patheo);
  });  
}

var patheo=mongoose.model('patheo',patheoSchema);
module.exports = patheo;
