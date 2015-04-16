'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        var requiredResources = {
            account: ['AuthSharedService', function (AuthSharedService) {
                return AuthSharedService.currentUser();
            }]
        };

        // Routes
        $routeProvider
            .when('/editSecurityQuestions', {
                templateUrl: 'client-facing/security_question/edit/secret-question-edit.html',
                controller: 'SecretQuestionEditController',
                title: 'Edit security Question',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
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
                resolve: requiredResources
            });

    })
;

