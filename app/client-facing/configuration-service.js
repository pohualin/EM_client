'use strict';
angular.module('emmiManager')

/**
 * Service for configuration.
 */
    .service('ConfigurationService', ['$rootScope','$location'],
    function ($rootScope,$location) {
        return {
            routeUser:function(){
                if (!$rootScope.account.clientResource.entity.contractOwner.emailValidated) {
                    $location.path('/validateEmail').replace();
                } else if ($location.path() === '/login') {
                    var priorRequestPath = $rootScope.locationBeforeLogin;
                    if (priorRequestPath) {
                        $location.path(priorRequestPath.path()).replace();
                    } else {
                        $location.path('/').replace();
                    }
                }
            }
        };
    });


