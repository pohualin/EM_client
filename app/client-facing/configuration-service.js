'use strict';
angular.module('emmiManager')

/**
 * Service for configuration.
 */
    .service('ConfigurationService', ['$rootScope', '$location', 'Session',
        function ($rootScope, $location, Session) {
            return {
                routeUser: function () {
                    if (!Session.interruptLoginFlow &&(!Session.email || !Session.emailValidated || !Session.secretQuestionCreated)) {
                        //if email was not supplied
                        $location.path('/passwordInformation').replace();
                    } else if ($location.path() === '/login') {
                        var priorRequestPath = $rootScope.locationBeforeLogin;
                        if (priorRequestPath && priorRequestPath.path() !== "/login") {
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


