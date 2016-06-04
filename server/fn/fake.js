var faker = require('faker');
var uuid = require('uuid');
var Promise = require('bluebird');
var range = appRequire('util/range');



var fake = module.exports = {

	user: {
		username      : faker.internet.userName(),
		email         : faker.internet.email(),
		full_name     : faker.name.firstName() + ' ' + faker.name.lastName(),
		//password      : bcrypt.hashSync(password),
		//plain_password: password,
		social_accounts:{ "facebook_id": uuid(),
		                   "twitter_id": uuid(),
		                    "googleplus_id" : uuid()
		                },
		user_location : {"lat": 33.33, "lng": 77.61},
		details       : {
		    age   :faker.helpers.randomNumber(19, 60),
		    gender: 'M' ,
		},
		imported_data : faker.helpers.contextualCard(),
		avatar: faker.helpers.contextualCard().avatar

	},

	me: {
		username      : faker.internet.userName(),
		email         : faker.internet.email(),
		full_name     : faker.name.firstName() + ' ' + faker.name.lastName(),
		//password      : bcrypt.hashSync(password),
		//plain_password: password,
		social_accounts:{ "facebook_id": uuid(),
		                   "twitter_id": uuid(),
		                    "googleplus_id" : uuid()
		                },
		user_location : {"lat": 33.33, "lng": 77.61},
		details       : {
		    age   :faker.helpers.randomNumber(19, 60),
		    gender: 'M' ,
		},
		imported_data : faker.helpers.contextualCard(),
		avatar: faker.helpers.contextualCard().avatar

	},

	users : 
		Promise.all(range(1, 80).map(function(n) {
			var users = {
            username      : faker.internet.userName(),
            email         : faker.internet.email(),
            full_name     : faker.name.firstName() + ' ' + faker.name.lastName(),
            social_accounts:{ "facebook_id": uuid(),
                               "twitter_id": uuid(),
                                "googleplus_id" : uuid()
                            },
            user_location : {"lat": 33.33, "lng": 77.61},
            details       : {
                age   :faker.helpers.randomNumber(19, 60),
                gender: n % 2 === 0 ? 'M' : 'F',
            },
            imported_data : faker.helpers.contextualCard()
			};
		return users;
    }))
	    


};