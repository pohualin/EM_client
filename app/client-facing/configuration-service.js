'use strict';
angular.module('emmiManager')

/**
 * Service for configuration.
 */
    .service('ConfigurationService', ['$rootScope', '$location', 'Session',
        function ($rootScope, $location, Session) {
            return {
                routeUser: function (data) {
                    if (!Session.interruptLoginFlow &&(!Session.email || !Session.emailValidated || !Session.secretQuestionCreated)) {
                        //if email was not supplied
                        $rootScope.userData = data;
                        $location.path('/passwordInformation').replace();
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


