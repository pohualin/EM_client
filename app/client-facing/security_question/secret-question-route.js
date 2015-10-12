'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        // Routes
        $routeProvider
            .when('/editSecurityQuestions', {
                templateUrl: 'client-facing/security_question/edit/secret-question-edit.html',
                controller: 'SecretQuestionEditController',
                title: 'Edit Security Questions',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                reloadOnSearch: false,
                resolve: {
                    secretQuestionChoices: ['AuthSharedService', 'SecretQuestionService',
                        function (AuthSharedService, SecretQuestionService) {
                            return AuthSharedService.currentUser().then(function () {
                                return SecretQuestionService.getSecretQuestions().then(function (response) {
                                    return response.data.content;
                                });
                            });
                        }]
                }
            });

        // Routes
        $routeProvider
            .when('/viewSecurityQuestions', {
                templateUrl: 'client-facing/security_question/edit/secret-question-view.html',
                controller: 'SecretQuestionViewController',
                title: 'Create or View Security Question',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                reloadOnSearch: false,
                resolve: {
                    securityQuestions: ['$q', 'AuthSharedService', 'SecretQuestionService',
                        function ($q, AuthSharedService, SecretQuestionService) {
                            var deferred = $q.defer();
                            AuthSharedService.currentUser().then(function () {
                                SecretQuestionService.getSecretQuestions().then(function (response) {
                                    if (response) {
                                        deferred.resolve(response.data.content);
                                    } else {
                                        deferred.reject();
                                    }
                                });
                            });
                            return deferred.promise;
                        }]
                }
            });

    })
;

