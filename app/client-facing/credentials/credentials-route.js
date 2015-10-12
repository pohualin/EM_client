'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        // Routes
        $routeProvider

            .when('/credentials/expired', {
                templateUrl: 'client-facing/credentials/expired/expired.html',
                controller: 'CredentialsExpiredController',
                title: 'Password Expired',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                reloadOnSearch: false,
                resolve: {
                    credentials: ['$rootScope', '$q',
                        function ($rootScope, $q) {
                            var deferred = $q.defer();
                            if ($rootScope.expiredCredentials) {
                                deferred.resolve($rootScope.expiredCredentials);
                            } else {
                                deferred.reject();
                            }
                            return deferred.promise;
                        }],
                    client: ['$rootScope', '$q',
                        function ($rootScope, $q) {
                            var deferred = $q.defer();
                            if ($rootScope.expiredClient) {
                                deferred.resolve($rootScope.expiredClient);
                            } else {
                                deferred.reject();
                            }
                            return deferred.promise;
                        }]
                }
            })
            .when('/credentials/forgot', {
                templateUrl: 'client-facing/credentials/forgot/forgot.html',
                controller: 'CredentialsForgottenController',
                title: 'Password Reset',
                reloadOnSearch: false,
                access: {
                    authorizedRoles: '*'
                }
            })
            .when('/activate/:activationKey/:trackingToken?', { // link + tracking code
                templateUrl: 'client-facing/credentials/activation/activate.html',
                controller: 'ActivateClientUserController',
                title: 'Activate User',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                reloadOnSearch: false,
                resolve: {
                    activationCode: ['$route', '$q', 'ActivateClientUserService', function ($route, $q, svc) {
                        var deferred = $q.defer();
                        var activationKey = $route.current.params.activationKey,
                            trackingToken = $route.current.params.trackingToken;
                        if (activationKey) {
                            svc.validateActivationToken(activationKey, trackingToken).success(function () {
                                deferred.resolve(activationKey);
                            });
                        } else {
                            deferred.reject();
                        }
                        return deferred.promise;
                    }]
                }
            })
            .when('/reset_password/:resetToken/:trackingToken?', {
                templateUrl: 'client-facing/credentials/reset/validateSecurityResponses/validate-security-question.html',
                controller: 'ValidateSecurityQuestionController',
                title: 'Validate Security Questions',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                reloadOnSearch: false,
                resolve: {
                    resetToken: ['$route', '$q', 'SecretQuestionService', '$location', 'LoginErrorMessageFactory',
                        function ($route, $q, SecretQuestionService, $location, LoginErrorMessageFactory) {
                            var deferred = $q.defer(),
                                resetToken = $route.current.params.resetToken,
                                trackingToken = $route.current.params.trackingToken;
                            if (resetToken) {
                                SecretQuestionService.validateUserSecurityResponse(resetToken, null,
                                    trackingToken).then(
                                    function ok(response) {
                                        if (angular.equals(response, 'true')) {
                                            // don't need to answer questions
                                            $location.url('/reset_pw/reset/' + resetToken).replace();
                                        } else {
                                            deferred.resolve(resetToken);
                                        }
                                    },
                                    function error(err) {
                                        if (err.status === 403) {
                                            // not authorized for an not authenticated route
                                            $location.path('/unauthorized').replace();
                                        } else {
                                            // problem with validate call
                                            angular.extend(LoginErrorMessageFactory, {showResetPasswordTokenExpired: true});
                                            $location.path('/login').replace();
                                        }
                                    }
                                );
                            } else {
                                // no reset token
                                deferred.reject();
                            }
                            return deferred.promise;
                        }]
                }
            })
            .when('/reset_pw/reset/:resetToken', {
                templateUrl: 'client-facing/credentials/reset/reset.html',
                controller: 'ResetClientUserPasswordController',
                title: 'Reset Password',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                reloadOnSearch: false,
                resolve: {
                    securityQuestions: ['$q', 'SecretQuestionService', function ($q, SecretQuestionService) {
                        return SecretQuestionService.getUserInputSecurityResponses();
                    }],
                    resetToken: ['$route', '$q', function ($route, $q) {
                        var deferred = $q.defer();
                        if ($route.current.params.resetToken) {
                            deferred.resolve($route.current.params.resetToken);
                        } else {
                            deferred.reject();
                        }
                        return deferred.promise;
                    }]
                }
            })
        ;
    })
;
