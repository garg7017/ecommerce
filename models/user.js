var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	email:{
		type:String,
		unique:true,
		lowercase:true
	},
	password:{
		type:String
	},
	profile:{
		name:{
			type:String,
			default:''
		},
		picture:{
			type:String,
			default:''
		}
	},
	address:{
		type:String
	},
	history:[{
		date:Date,
		paid:{
			type:Number,
			default:0
		}
	}]
});
/** Hash the password beofre we even save it in the database */
UserSchema.pre('save',function(next) {
	var user = this;
	if(!user.isModified('password')){
		return next();
	}
	bcrypt.genSalt(10, function(err,salt) {
		if(err){
			return next(err);
		}
		bcrypt.hash(user.password,salt,null,function(err,hash) {
			if(err){
				return next(err);
			}
			user.password = hash;
			next();
		});
	});
});

/** Compare password in the database and the one that the user typed in*/
UserSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('User',UserSchema);