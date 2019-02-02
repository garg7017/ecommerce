var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var Product = require('../models/product');


router.get('/:name',(req,res,next) => {

	async.waterfall([

		function(callback) {
			Category.findOne({ name: req.params.name},(err,category) => {
				if(err) throw next(err);
				callback(null,category);
			});
		},

		function(category,callback) {
			for(var i = 0; i < 30; i++){
				var product = new Product();
				product.category = category._id;
				product.name = faker.commerce.ProductName();
				product.price = faker.commerce.price();
				product.image = faker.commerce.image();

				product.save();
			}
		}
	]);
	res.json({message: 'Success' });

});

module.exports = router;