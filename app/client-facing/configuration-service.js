'use strict';
angular.module('emmiManager')

/**
 * Service for configuration.
 */
    .service('ConfigurationService', ['$rootScope', '$location', 'Session', 'moment',
        function ($rootScope, $location, Session, moment) {
            return {
                routeUser: function () {
                    var skipInformationCollection = false;

                    if (Session.notNowExpirationTime) {
                        skipInformationCollection =  moment(Session.notNowExpirationTime + 'Z').isBefore();
                    }

                    if(!Session.secretQuestionCreated){
                        $location.path('/createSecretQuestions').replace();
                    }
                    if (!Session.email && !skipInformationCollection) {
                        //if email was not supplied
                        $location.path('/addEmail').replace();
                    } else if (!Session.emailValidated && !skipInformationCollection) {
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


