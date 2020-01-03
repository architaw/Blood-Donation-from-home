const bcrypt = require('bcrypt');
var mongoose=require('mongoose');
var testSchema2= new mongoose.Schema({time:String,scheduledDate:String,name:String,quantity:String,bloodGroup:String,number:String,address:String,certificateLink:String,donationId:String});
var testSchema3= new mongoose.Schema({time:String,deadline:String,name:String,quantity:String,bloodGroup:String,number:String,address:String,requestId:String });
var ngoSchema = new mongoose.Schema({
    name : String,
    password : String,
    address: String,
    mobile : { type: String, index: { unique: true } },
    email:String,
    bloodDonation:[testSchema2],
    bloodDonationDone:[testSchema2],
    bloodRequest:[testSchema3],
    bloodRequestDone:[testSchema3]
}); 

// ngoSchema.pre('save', function (next) {
//     var ngo = this;
//     bcrypt.hash(ngo.password, 10, function (err, hash){
//       if (err) {
//         return next(err);
//       }
//       ngo.password = hash;
//       next();
//     })
// });

ngoSchema.statics.hashing = function(ngo,callback){
  // bcrypt.hash(ngo.password, 10, function (err, hash){
  //   if (err) {
  //     return callback(err);
  //   }
  //   ngo.password = hash;
    return callback();
  //})
}

ngoSchema.statics.auth = function (number, password, callback){
    ngo.findOne({ mobile: number }, function(err, ngo) {
        if (err) return callback(err);
        else if(!ngo){
            return callback(null);
        }
        else{
            // bcrypt.compare(password, ngo.password, function(err, isMatch) {
            //     if (err) {
            //         return callback(err);
            //     }
            //     else{
            //         return callback(null,ngo,isMatch);
            //     }
            // })
            if(password===ngo.password){
              return callback(null,ngo,true);
            }
            else{
              return callback(null,ngo,false);
            }
        }
    })
}

ngoSchema.statics.made = function (number,NGO,callback){
  ngo.findOne({ mobile: number }, function(err, ngo) {
    if (err) return callback(err); 
    if(!ngo){
        NGO.save(function(err,ngo){
          if (err) return callback(err); 
          return callback(null,ngo);
        })	
    } 
    else{
      return callback(null,null);
    }
});
}


var ngo=mongoose.model('ngo',ngoSchema);
module.exports = ngo;
