
var Promise = require('bluebird');
var _ = require('lodash');

var api = require('api');

var data = module.exports = {

    

    /**
     * get a promise for currently logged in user
     */
    getMe: function (token) {
        return api.get('/auth/profile', {
            token: token,
        });
    },


    /**
     * get a user's profile by username
     */
    getUser: function (username, token) {
        return api.get('/users/profile/' + username, {
            token: token,
        });
    },

    /**
     * get a user by id
     */
    getUserById: function (userid, token) {
        return api.get('/users/' + userid, {
            token: token,
        });
    },
    /**
     * get a user's profile by username
     */
    getUserFeed: function (username, token, page, per_page, offset) {
        return api.get('/users/profile/social/' + username, {
            token: token,
            qs: {
                page: page,
                per_page: per_page,
                offset: offset
            }
        });
    },


    getProjects: function (token, page, per_page, offset, orderBy) {
        return api.get('/projects', {
            token: token,
            qs: {
                page: page,
                per_page: per_page,
                offset: offset,
                orderBy: orderBy
            }
        })
    },

    getProjectById: function (token, id) {
        return api.get('/projects/' + id, {
            token: token
        })
    },

    getUsers: function (token, page, per_page, offset) {
        return api.get('/users?', {
            token: token,
            qs: {
                page: page,
                per_page: per_page,
                offset: offset
            }
        })
    }


};