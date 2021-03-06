'use strict';

angular.module('emmiManager')
    .factory('Session', [ function () {
        this.create = function (user) {
            this.id = user.id;
            this.login = user.login;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.email = user.email;
            this.userRoles = user.permission;
            this.link = user.link;
            this.webApiUser = user.webApiUser;
            return this;
        };
        this.destroy = function () {
            this.id = null;
            this.login = null;
            this.firstName = null;
            this.lastName = null;
            this.email = null;
            this.userRoles = null;
            this.link = null;
            this.webApiUser = null;
        };
        return this;
    }])
;
