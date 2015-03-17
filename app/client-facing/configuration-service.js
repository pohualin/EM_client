'use strict';
angular.module('emmiManager')

/**
 * Service for configuration.
 */
    .service('ConfigurationService', ['$rootScope','$location', '$q', 'Session','SecretQuestionService',
    function ($rootScope,$location,$q,Session,SecretQuestionService) {
        return {
        	
            routeUser:function(){
            	var promise = SecretQuestionService.isClientUserHasSecretQuestions(); 
                promise.then(function(response){
                	// If user has not create secret question yet
                	if(!response){
                	   $location.path('/createSecretQuestions').replace();
           		    }
                });
            	                              	
                if (!Session.emailValidated && Session.email) {
                    //if email is not verified for user
            	     $location.path('/validateEmail').replace();
                }
            	else if ($location.path() === '/login') {
                    var priorRequestPath = $rootScope.locationBeforeLogin;
                    if (priorRequestPath) {
                        //if user was trying to access a url
                        $location.path(priorRequestPath.path()).replace();
                    } else {
                        //if user is just logging in
                        $location.path('/').replace();
                    }
                }
            }
        };
   
    }]);


