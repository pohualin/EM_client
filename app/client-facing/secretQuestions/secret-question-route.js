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
        .when('/secretQuestions', {
            templateUrl: 'client-facing/secretQuestions/secret-question.html',
            controller: 'SecretQuestionController',
             access: {
                 authorizedRoles: [USER_ROLES.all]
             },
             resolve: requiredResources
        })
      
    })
;

