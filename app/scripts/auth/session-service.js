'use strict';

angular.module('emmiManager')
    .factory('Session', [ function () {
        this.create = function (login, firstName, lastName, email, userRoles, link) {
            this.login = login;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.userRoles = userRoles;
            this.link = link;
            return this;
        };
        this.destroy = function () {
            this.login = null;
            this.firstName = null;
            this.lastName = null;
            this.email = null;
            this.userRoles = null;
            this.link = null;
        };
        return this;
    }])
;
