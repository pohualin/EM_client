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
        .when('/editSecurityQuestions', {
            templateUrl: 'client-facing/secretQuestions/edit/secret-question-edit.html',
            controller: 'SecretQuestionEditController',
            title: 'Edit security Question',
             access: {
                 authorizedRoles: [USER_ROLES.all]
             },
             resolve: requiredResources
        });
        
        // Routes
        $routeProvider
        .when('/viewSecurityQuestions', {
            templateUrl: 'client-facing/secretQuestions/edit/secret-question-view.html',
            controller: 'SecretQuestionViewController',
            title: 'Create or View Security Question',
             access: {
                 authorizedRoles: [USER_ROLES.all]
             },
             resolve: requiredResources
        });
        
        // Routes
        $routeProvider
        .when('/createSecurityQuestions', {
            templateUrl: 'client-facing/secretQuestions/create/secret-question-create.html',
            controller: 'SecretQuestionCreateController',
            title: 'Create security Question',
             access: {
                 authorizedRoles: [USER_ROLES.all]
             },
             resolve: requiredResources
        });
        
     // Routes
        $routeProvider
        .when('/securityQuestions', {
            templateUrl: 'client-facing/secretQuestions/secret-question.html',
            controller: 'SecretQuestionController',
            title: 'Security Question',
             access: {
                 authorizedRoles: [USER_ROLES.all]
             },
             resolve: requiredResources
        });
      
    })
;

