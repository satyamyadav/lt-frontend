var _ = require('lodash');
var models = require('./models');


var resumeData = {

  "work": [
  {
  "company": "frankly.me",
  "endDate": "2015-05-30",
  "summery": "web intern",
  "website": "http://frankly.me",
  "position": "Intern",
  "startDate": "2015-02-19",
  "highlights": "widgets, html, bootstrap, angular, jquery"
  },
  {
  "company": "frankly.me",
  "endDate": "2015-09-30",
  "summery": "nodejs, expressjs",
  "website": "http://frankly.me",
  "position": "web developer",
  "startDate": "2015-07-01",
  "highlights": "site, widgets, hiring panel, admin panel"
  },
  {
  "company": "flatabout",
  "startDate": "2015-10-01",
  "endDate": "2015-11-30",
  "summery": "Frontend",
  "website": "http://flatabout.com",
  "position": "full stack developer",
  "highlights": "html, sass, jquery, nodejs, psql"
  }
  ],
  "awards": [
  {
  "date": "2013-03-22",
  "title": "representation",
  "awarder": "SCRIET Cultural Society"
  }
  ],
  "basics": {
  "dob": "1993-09-15",
  "name": "Satyam Yadav",
  "email": "satyamyadav3@gmail.com",
  "label": "Web Developer",
  "mobile": "7376867678",
  "summery": "I aspire to work in an environment demanding technical, programming , communication and functional expertise for facing and overcoming everyday challenges which require me to be up to date with the technology and continuously strive for enhancing my skills.",
  "location": {
  "pin": "110096",
  "city": "Delhi",
  "address": "Ashoknagar"
  },
  "profiles": [
  {
  "network": "facebook",
  "username": "satyam.py"
  },
  {
  "network": "github",
  "username": "satyamyadav"
  }
  ]
  },
  "skills": [
  {
  "name": "Frontend",
  "keywords": "html,css,javascript"
  },
  {
  "name": "Backend",
  "keywords": "Nodejs, python"
  }
  ],
  "hobbies": "drawing, music",
  "education": [
  {
  "gpa": "70",
  "field": "Bachelor (Computer Science)",
  "endDate": "2016-05-31",
  "startDate": "2012-07-22",
  "university": "C.C.S. University, Meerut",
  "institution": "SCRIET"
  },
  {
  "gpa": "62%",
  "field": "Intermidate",
  "endDate": "2010-03-30",
  "startDate": "2009-03-30",
  "university": "CBSE",
  "institution": "Gyankunj Academy"
  },
  {
  "gpa": "78%",
  "field": "High School",
  "endDate": "2008-03-05",
  "startDate": "2005-03-05",
  "university": "CBSE",
  "institution": "St. Xavier's School Ballia"
  }
  ],
  "references": [
  {
  "name": "me",
  "reference": "enthusiastic"
  }
  ]
}
  






var userBuilder = function (data, token) {
  //console.log('builder', data);

  return models.User({
    id: data.id,
    access_token: token ? token : null,
    username: data.username,
    full_name: data.full_name,
    email: data.email,
    created_at: data.created_at,
    updated_at: data.updated_at,
    picture: data.picture ? data.picture : 'images/user.png' ,
    details: _.isNull(data.details) || _.isUndefined(data.details) ? {} : detailBuilder(data.details),
    imported_data: _.isNull(data.imported_data) || _.isUndefined(data.imported_data) ? {} : data.imported_data,
    /*details: data.details.map(function (detail) {
      return detailBuilder(detail);
    })*/
    followers: _.isUndefined(data.followers) ? [] : data.followers
  });
};




var detailBuilder = function (data) {
  return models.userDetails({
    bio: data.bio,
    gender: data.gender,
    skills: data.skills,
    department: data.department,
    image_urls: data.image_urls,
    passing_year: data.passing_year,
    admission_year: _.isUndefined(data.admission_year) ? data.addmission_year : data.admission_year,
    resume: _.isUndefined(data.resume) ? resumeData : data.resume 
  });
};






module.exports = [
  {
    method: 'POST',
    pattern: /^(\/auth\/login|\/auth\/register|\/auth\/social\/[^\/]+)$/i,
    translate: function (data) {
      return {
        user: userBuilder(data.data, data.data.access_token)
      };
    }
  },
  {
    method: 'GET',
    pattern: /^\/auth\/profile$/i,
    translate: function (data) {
      return {
        user: userBuilder(data.data, data.data.access_token)
      };
    }
  },
  {
    method: 'GET',
    pattern: /^\/users\/profile|\/social|\/users\/[^\/]/,
    translate: function (data) {
      //console.log('translate data :', data);
      return {
        user: userBuilder(data.data, data.data.access_token),
        projects: !_.isUndefined(data.projects) ? data.projects : []
      };
    }
  },

  {
    method: 'GET',
    pattern: /^\/users/,
    translate: function (data) {
      return {
        users: data.data.map(function(d){
          return  userBuilder(d, d.access_token);
        })
      };
    }
  },

];
