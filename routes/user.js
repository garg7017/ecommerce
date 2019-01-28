var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConf = require('../config/passport');

// router.post('/create-user',(req,res,next) => {
// 	var user = new User;

// 	user.email = req.body.email;
// 	user.password = req.body.password;
// 	user.profile.name = req.body.name;

// 	user.save((err) => {
// 		if(err){
// 			return next(err);
// 		} else {
// 			res.json("Successfully created a new user");
// 		}
// 	});
// });

router.get('/login',(req,res,next) => {
	// res.json("not login");
	if(req.user) return res.redirect('/');
	res.render('accounts/login',{
		errors: req.flash('loginMessage')
	});
});

router.post('/login', passport.authenticate('local-login',{
	successRedirect:'/profile',
	failureRedirect:'/login',
	failureFlash:true
}));


router.get('/profile',(req,res,next) => {
	// res.json(req.user);
	User.findOne({_id:req.user._id},(err,user) => {
		if(err){
			return next(err);
		}
		res.render('accounts/profile',{ user:user });	
	});
	
});

router.get('/signup',(req,res,next) => {
	res.render('accounts/signup',{
		errors:req.flash('errors')
	});
});

router.post('/signup',(req,res,next) => {
	var user = new User;
	user.profile = req.body.profile;
	user.email = req.body.email;
	user.password = req.body.password;
	User.findOne({email:req.body.email}, function(err, existingUser){
		if(existingUser){
			console.log(`${req.body.email} is already exists`);
			req.flash('errors','Email is already exists');
			return res.redirect('/signup');
		} else {
			user.save((err,user) => {
				console.log(err);
				if(err) return next(err);

				return res.redirect('/');
				// req.flash('success',`${req.body.email} is already exists`);
				// res.json("New User has been created");
			})
		}
	});
});

module.exports = router;