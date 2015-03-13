'use strict';

angular.module('emmiManager')
    .factory('Session', ['arrays', function (arrays) {
        this.create = function (user) {
        	this.id = user.id;
        	this.version = user.version;
            this.login = user.login;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.email = user.email;
            this.emailValidated = user.emailValidated;
            this.userRoles = user.permission;
            this.link = user.link;
            this.clientResource = user.clientResource;
            if (user.passwordExpirationTime) {
                this.passwordExpirationTime = user.passwordExpirationTime + 'Z';
            }
            if (user.teams) {
                angular.forEach(user.teams, function(team) {
                    team.link = arrays.convertToObject('rel', 'href',
                        team.link);
                });
            }
            this.teams = user.teams;
            if (this.clientResource) {
                this.clientResource.link = arrays.convertToObject('rel', 'href',
                    this.clientResource.link);
            }
            return this;
        };
        this.destroy = function () {
            this.login = null;
            this.firstName = null;
            this.lastName = null;
            this.email = null;
            this.emailValidated = null;
            this.userRoles = null;
            this.link = null;
            this.clientResource = null;
            this.passwordExpirationTime = null;
            this.teams = null;
        };
        return this;
    }])
;
