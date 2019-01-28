var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

//serialise and deserialize
passport.serializeUser((user,done) => {
	done(null, user._id);

});

passport.deserializeUser((id,done) => {
	User.findById(id, (err,user) => {
		done(err,user);
	});
});

//Middleware
passport.use('local-login', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},(req,email,password,done) => {
	User.findOne({
		email:email
	},(err,user)=>{
		// console.log("eyeetywew");
		if(err) return done(err);
		if(!user){
			// console.log("aaa");
			return done(null, false,req.flash('loginMessage','No user has been found'));
		}
		if(!user.comparePassword(password)){
			// console.log("bbb");
			return done(null,false,req.flash(';loginMessage','Opps! Wrong Password'));
		}
		return done(null,user);
	});
}));


//Custom Function to validate

exports.isAuthanticated = (req,res,next) => {
	if(req.isAuthanticated()){
		return next();
	}
	res.redirect('/login');
}