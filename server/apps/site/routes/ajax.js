var app = module.exports = require('express')();
var _ = require('lodash');
var xssFilters = require('xss-filters');
var Promise = require('bluebird');

var api = require('api');
var fn = require('fn');
var view = require('view').prefix('site');
var pages = require('apps/site/partials');
var s3Client = require('s3client');
var authFilter = fn.filters.authFilter;
var path = require('path');
var fs = require('fs');





/** add project
 */

app.post('/addproject', authFilter, function (req, res) {
	console.log(req.body);
	var data = {
		title: req.body.title,
		short_description: req.body.short_description,
		idea: req.body.idea,
		image_urls: req.body.image_urls,
		details: req.body.details,
		type: req.body.type
	};
	api.post('/projects/addproject', {
		json: data,
		token: req.token
	}).then(function (data) {
			res.send(data);
		},
		function (err) {
			res.send(err);
		});
});


/**
 * upvote project
 */

app.post('/project/:projectId/upvote', authFilter, function (req, res) {
	var projectId = req.params.projectId;
	api.post('/projects/' + projectId + '/upvote', {
		token: req.token,
	}).then(function (data) {
			res.send(data);
		},
		function (err) {
			res.send(err);
		});
});

/**
 * downvote project
 */

app.post('/project/:projectId/downvote', authFilter, function (req, res) {
	var projectId = req.params.projectId;
	api.delete('/projects/' + projectId + '/upvote', {
		token: req.token,
	}).then(function (data) {
			res.send(data);
		},
		function (err) {
			res.send(err);
		});
});


/**
 * add comment on project
 */

app.post('/project/:projectId/comment', authFilter, function (req, res) {
	var projectId = req.params.projectId;
	var comment = req.body.comment;
	api.post('/projects/' + projectId + '/comment', {
		json: {
			comment: comment
		},
		token: req.token,
	}).then(function (data) {
			res.send(data);
		},
		function (err) {
			res.send(err);
		});
});



/**
 * update profile
 */

app.put('/profile/:userId', authFilter, function (req, res) {
	console.log('req aayi hai ', req.body);
	var userId = req.params.userId;
	api.put('/auth/profile', {
		json: {
			data: req.body
		},
		token: req.token,
	}).then(function (data) {
			console.log('ser res data', data);
			res.send(data);
		},
		function (err) {
			res.send(err);
		});
});


/**
 * update resume
 */

app.put('/resume/:userId', authFilter, function (req, res) {
	console.log('req aayi hai ', req.body);
	var userId = req.user.id;
	var data = req.user;
	data.details.resume = req.body;
	api.put('/auth/profile', {
		json: {
			data: req.body
		},
		token: req.token,
	}).then(function (data) {
			console.log('ser res data', data);
			res.send(data);
		},
		function (err) {
			res.send(err);
		});
});


/*
  Upload to upload directory and return url
 */
app.post('/upload', function (req, res) {

	//console.log(req.body);

	if (req.body.imgBase64) {
		var data_url = req.body.imgBase64;
		var matches = data_url.match(/^data:.+\/(.+);base64,(.*)$/);
		var ext = matches[1];
		var base64_data = matches[2];
		var buffer = new Buffer(base64_data, 'base64');
		var imgUrl = req.body.imgUrl; //'images/icards/icard' + req.user.id + 'img.png'; 
		fs.writeFile(path.resolve('./public/' + imgUrl ), buffer, function (err) {
			res.send(imgUrl);
		});
	} else {

		var uploadedData = req.files['file'];
		if (_.isArray(req.files.file)) {
			var fileArray = _.map(req.files['file'], function (file) {
				var tempPath = file.path;
				targetPath = path.resolve('./public/images/project-images/' + file.name );
				
				return Promise.props({
					key: file.name,
					image: file,
					url: 'images/project-images/' + file.name,
					upload: fs.rename(tempPath, targetPath)
					
				});
			});
			Promise.join(Promise.props(fileArray)).then(function (data) {
				_.omit(data[0], ['s3Instance']);
				res.send({
					uploadedFiles: data[0]
				});
			}).catch(function (e) {
				res.status(500).send({
					error: 'Failed'
				});
			});

		} else {

			var file = req.files['file'];
			//console.log(file);
			var tempPath = file.path;
			targetPath = path.resolve('./public/images/project-images/' + file.name );
			Promise.props({
				key: file.name,
				image: file,
				url: 'images/project-images/'  + file.name,
				upload: fs.rename(tempPath, targetPath)
			}).then(function (data) {
				res.send({
					uploadedFiles: [data]
				});
			}).catch(function (e) {
				res.status(500).send({
					error: "failed"
				});
			});
		}
	};    
});









/*
  Upload to S3 bucket and return url
 */
app.post('/upload/s3', function (req, res) {
	//console.log(req.body);
	var uploadedData = req.files['file'];
	if (_.isArray(req.files.file)) {
		var fileArray = _.map(req.files['file'], function (file) {
			var params = {
				localFile: file.path,
				s3Params: {
					Bucket: "flat.photos",
					Key: file.name,
					ACL: "public-read",
				},
			};
			return Promise.props({
				key: file.name,
				image: file,
				url: 's3/bucket/url' + file.name,
				s3Instance: s3Client.uploadFile(params)
			});
		});
		Promise.join(Promise.props(fileArray)).then(function (data) {
			_.omit(data[0], ['s3Instance']);
			res.send({
				uploadedFiles: data[0]
			});
		}).catch(function (e) {
			res.status(500).send({
				error: 'Failed'
			});
		});

	} else {

		var file = req.files['file'];
		var params = {
			localFile: file.path,
			s3Params: {
				Bucket: "flat.photos",
				Key: file.name,
				ACL: "public-read",
			},
		};
		Promise.props({
			key: file.name,
			image: file,
			url: 's3/bucket/url' + file.name,
			s3Instance: s3Client.uploadFile(params)
		}).then(function (data) {
			res.send({
				uploadedFiles: [data]
			});
		}).catch(function (e) {
			res.status(500).send({
				error: "failed"
			});
		});
	}
});


/**
 * follow/unfollow a user
 * REQUIRES AUTH FILTER
 * params - userId
 */
app.post('/follow/:userId', authFilter, function (req, res) {
	console.log(req.body);
  api.post('/users/follow/' + req.params.userId , {
    json: {user_id: req.params.userId},
    token: req.token
  }).then(
    function (data) {
      res.send({msg: 'success'});
    },
    function (err) {
      res.status(400).send({msg: 'failed'});
    }
  );
});


/**
 * Unfollow user
 * requires - authfilter
 * params - userId
 */
app.post('/unfollow/:userId', authFilter, function (req, res) {
  api.delete('/users/unfollow/'  + req.params.userId , {
    json: {user_id: req.params.userId},
    token: req.token
  }).then(
    function (data) {
      res.send({msg: 'success'});
    },
    function (err) {
      res.status(400).send({msg: 'failed'});
    }
  );
});