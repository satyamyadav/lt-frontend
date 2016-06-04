var env = process.env.NODE_ENV || 'development';

var production = {
    port: process.env.PORT || 5000,
    publicDir: __dirname + '/../public',
    uploadsDir: __dirname + '/../storage/uploads',
    sessionDir: __dirname + '/../storage/sessions',
    apiBase: 'http://site.com'
};
var staging = {
    port: 3000,
    publicDir: __dirname + '/../public',
    uploadsDir: __dirname + '/../storage/uploads',
    sessionDir: __dirname + '/../storage/sessions',
    apiBase: 'http://localhost:3030'
};

var development = {
    port: process.env.PORT || 5000,
    publicDir: __dirname + '/../public',
    uploadsDir: __dirname + '/../storage/uploads',
    sessionDir: __dirname + '/../storage/sessions',
    apiBase: 'http://localhost:3030'
};


module.exports = {
    app: development
};