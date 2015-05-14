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
            this.secretQuestionCreated = user.secretQuestionCreated;
            this.userRoles = user.permission;
            this.link = user.link;
            this.clientResource = user.clientResource;
            this.impersonated = user.impersonated;
            this.interruptLoginFlow = user.interruptLoginFlow;
            this.securityQuestionsNotRequiredForReset = user.securityQuestionsNotRequiredForReset;
            if(user.notNowExpirationTime){
                this.notNowExpirationTime = user.notNowExpirationTime + 'Z';
            }
            if (user.passwordExpirationTime) {
                this.passwordExpirationTime = user.passwordExpirationTime + 'Z';
            }
            if (user.passwordSavedTime) {
                this.passwordSavedTime = user.passwordSavedTime + 'Z';
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
            this.id = null;
            this.login = null;
            this.firstName = null;
            this.lastName = null;
            this.email = null;
            this.emailValidated = null;
            this.secretQuestionCreated = false;
            this.userRoles = null;
            this.link = null;
            this.clientResource = null;
            this.passwordExpirationTime = null;
            this.teams = null;
            this.impersonated = null;
            this.notNowExpirationTime = null;
            this.interruptLoginFlow = null;
            this.securityQuestionsNotRequiredForReset = null;
        };
        return this;
    }])
;
