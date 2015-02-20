'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        // Routes
        $routeProvider
        .when('/', {
            templateUrl: 'client-facing/main/main.html',
            controller: 'MainCtrl',
            title: 'Home',
            access: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
         .when('/secretQuestions', {
            templateUrl: 'client-facing/secretQuestions/secret-question.html',
            controller: 'SecretQuestionController',
             access: {
                 authorizedRoles: [USER_ROLES.all]
             }
        })
      
    })
;

