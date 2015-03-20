'use strict';
angular.module('emmiManager')

/**
 * Service for configuration.
 */
    .service('ConfigurationService', ['$rootScope','$location','Session',
    function ($rootScope,$location,Session) {
        return {
            routeUser:function(){
            	if(!Session.secretQuestionCreated){
            		$location.path('/createSecretQuestions').replace();
           		}
            	
                if(!Session.email){
                    //if email was not supplied
                    $location.path('/addEmail').replace();
                } else if (!Session.emailValidated && Session.email) {
                    //if email is not verified for user
                    $location.path('/validateEmail').replace();
                } else if ($location.path() === '/login') {
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


