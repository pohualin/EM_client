'use strict';
angular.module('emmiManager')

/**
 * Service for configuration.
 */
    .service('ConfigurationService', ['$rootScope','$location',
    function ($rootScope,$location) {
        return {
            routeUser:function(){
                if (!$rootScope.account.emailValidated) {
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


