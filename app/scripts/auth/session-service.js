'use strict';

angular.module('emmiManager')
    .factory('Session', [ function () {
        this.create = function (login, firstName, lastName, email, userRoles, links) {
            this.login = login;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.userRoles = userRoles;
            if (links && links.length) {
                var arrayLength = links.length;
                for (var i = 0; i < arrayLength; i++) {
                    var link = links[i];
                    this[link.rel] = link;
                }
            }
            this.links = links;
        };
        this.destroy = function () {
            this.login = null;
            this.firstName = null;
            this.lastName = null;
            this.email = null;
            this.userRoles = null;
            this.links = null;
        };
        return this;
    }])
;
