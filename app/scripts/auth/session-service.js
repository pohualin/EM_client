'use strict';

/* Services */

var emSessionServices = angular.module('emSessionServices', []);

emSessionServices.service('Session', function(){

    this.create = function (sessionId, login, userId, userRoles) {
        this.id = sessionId;
        this.login = login;
        this.userId = userId;
        this.userRoles = userRoles;
    };
    //this.invalidate = function () {
    this.destroy = function () {
        this.id = null;
        this.login = null;
        this.userId = null;
        this.userRoles = null;
    };

});
