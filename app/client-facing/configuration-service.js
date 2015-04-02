'use strict';
angular.module('emmiManager')

/**
 * Service for configuration.
 */
    .service('ConfigurationService', ['$rootScope', '$location', 'Session', 'moment',
        function ($rootScope, $location, Session, moment) {
            return {
                routeUser: function () {
                    if(!Session.secretQuestionCreated && Session.interruptLoginFlow){
                        $location.path('/createSecretQuestions').replace();
                    } else if (!Session.email && Session.interruptLoginFlow) {
                        //if email was not supplied
                        $location.path('/addEmail').replace();
                    } else if (!Session.emailValidated && Session.interruptLoginFlow) {
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
        }])
;


