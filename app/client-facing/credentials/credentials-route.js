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
                access: {
                    authorizedRoles: '*'
                }
            })
            .when('/activate/:activationKey', {
                templateUrl: 'client-facing/credentials/activation/activate.html',
                controller: 'ActivateClientUserController',
                title: 'Activate User',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                    activationCode: ['$route', '$q', function ($route, $q) {
                        var deferred = $q.defer();
                        if ($route.current.params.activationKey) {
                            deferred.resolve($route.current.params.activationKey);
                        } else {
                            deferred.reject();
                        }
                        return deferred.promise;
                    }]
                }
            })
            .when('/reset_password/:resetToken', {
                templateUrl: 'client-facing/credentials/reset/validateSecurityResponses/validate-security-question.html',
                controller: 'ValidateSecurityQuestionController',
                title: 'Validate Security Questions',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
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
             .when('/reset_password/reset/:resetToken', {
                templateUrl: 'client-facing/credentials/reset/reset.html',
                controller: 'ResetClientUserPasswordController',
                title: 'Reset Password',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                	securityQuestions: ['$q', 'SecretQuestionService', function ($q, SecretQuestionService){
                		var deferred = $q.defer();
                        if (SecretQuestionService.getUserInputSecurityResponses()) {
                        	deferred.resolve(SecretQuestionService.getUserInputSecurityResponses());
                        } else {
                        	deferred.reject();
                        }
                        return deferred.promise;
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
            .when('/credentials/activation/failure', {
                templateUrl: 'client-facing/credentials/activation/activation_failure.html',
                title: 'Please Contact Support',
                access: {
                    authorizedRoles: '*'
                }
            })
            .when('/credentials/expired/failure', {
                templateUrl: 'client-facing/credentials/expired/expired_failure.html',
                title: 'Please Contact Support',
                access: {
                    authorizedRoles: '*'
                }
            })
            .when('/credentials/reset/failure', {
                templateUrl: 'client-facing/credentials/reset/reset_failure.html',
                title: 'Please Contact Support',
                access: {
                    authorizedRoles: '*'
                }
            })
        ;
    })
;
