var modelBuilder = require('./modelBuilder');

var User = modelBuilder(
  'User',
  ['id', 'username', 'full_name', 'email', 'access_token', 'picture', 'social_accounts', 
   'created_at', 'updated_at', 'details', 'imported_data', 'followers']
);

var userDetails = modelBuilder(
  'userDetails',
  ['bio', 'gender', 'skills', 'department', 'image_urls', 'passing_year', 'admission_year', 'resume']
);


module.exports = {
  User: User,
  userDetails: userDetails
};