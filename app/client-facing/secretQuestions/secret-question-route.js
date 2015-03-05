'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

    	 var requiredResources = {
    	            'account': ['AuthSharedService', function (AuthSharedService) {
    	                return AuthSharedService.currentUser();
    	            }]
    	        };
    	
    	 // Routes
        $routeProvider
        .when('/viewSecretQuestions', {
            templateUrl: 'client-facing/secretQuestions/edit/secret-question-view.html',
            controller: 'SecretQuestionEditController',
            title: 'View Secret Question',
             access: {
                 authorizedRoles: [USER_ROLES.all]
             },
             resolve: requiredResources
        });
        
        // Routes
        $routeProvider
        .when('/editSecretQuestions', {
            templateUrl: 'client-facing/secretQuestions/edit/secret-question-edit.html',
            controller: 'SecretQuestionEditController',
            title: 'Edit Secret Question',
             access: {
                 authorizedRoles: [USER_ROLES.all]
             },
             resolve: requiredResources
        });
        
        // Routes
        $routeProvider
        .when('/createSecretQuestions', {
            templateUrl: 'client-facing/secretQuestions/create/secret-question-create.html',
            controller: 'SecretQuestionEditController',
            title: 'Create Secret Question',
             access: {
                 authorizedRoles: [USER_ROLES.all]
             },
             resolve: requiredResources
        });
      
    })
;

