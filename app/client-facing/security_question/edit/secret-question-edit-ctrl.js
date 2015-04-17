'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user needs to select secret questions and responses.
 */
    .controller('SecretQuestionEditController', ['$scope', '$location', 'SecretQuestionService',
        '$alert', '$modal', 'Session', 'secretQuestionChoices',
        function ($scope, $location, SecretQuestionService, $alert, $modal, Session, secretQuestionChoices) {

            $scope.secretQuestionFormSubmitted = false;

            var promptPasswordModal = $modal({
                scope: $scope,
                template: 'client-facing/security_question/promptPassword.html',
                animation: 'none',
                backdropAnimation: 'emmi-fade',
                show: false,
                backdrop: 'static'
            });

            /**
             * When the save button is clicked. Sends all updates
             * to the back, then re-binds the form objects with the
             * results
             */
            $scope.saveOrUpdateSecretQuestion = function (valid) {
                $scope.secretQuestionFormSubmitted = true;
                if (valid) {
                    SecretQuestionService
                        .saveOrUpdateSecretQuestionResponse($scope.question1.entity, $scope.question2.entity).then(
                        function ok() {
                            $alert({
                                title: ' ',
                                content: 'Your security questions have been updated successfully.',
                                container: 'body',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                            $location.path('/viewSecurityQuestions').replace();
                        },
                        function notOk() {
                            $alert({
                                title: ' ',
                                content: 'There was a problem saving your security questions.',
                                container: 'body',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                            $location.path('/viewSecurityQuestions').replace();
                        }
                    );

                } else {
                    if (!$scope.formAlert) {
                        $scope.formAlert = $alert({
                            title: ' ',
                            content: 'Please correct the below information.',
                            container: '#message-container',
                            type: 'danger',
                            show: true,
                            dismissable: false
                        });
                    }
                }

            };

            /**
             * When the save button is clicked. Check if the user
             * selected 2 same questions or not
             */
            $scope.onChange = function () {
                if (angular.equals($scope.question1.entity.secretQuestion, $scope.question2.entity.secretQuestion) && !(angular.isUndefined($scope.question1.entity.secretQuestion))) {
                    $scope.secretQuestionForm.secretQuestion2.$setValidity('duplicated', false);
                } else {
                    $scope.secretQuestionForm.secretQuestion2.$setValidity('duplicated', true);
                }
            };

            $scope.promptPassword = function () {
                promptPasswordModal.$promise.then(promptPasswordModal.show);
            };

            $scope.validatePassword = function (passwordForm, password) {
                $scope.passowrd = password;
                passwordForm.isSubmitted = true;
                if (passwordForm.$valid) {
                    // fetch the secret question responses using the password
                    SecretQuestionService.getAllUserSecretQuestionResponse(password).then(
                        function success(response) {
                            var existingResponse = response.data.content;
                            // create the questions
                            $scope.question1 = existingResponse.length > 0 ? existingResponse[0] : SecretQuestionService.createNewResponse();
                            $scope.question2 = existingResponse.length > 1 ? existingResponse[1] : SecretQuestionService.createNewResponse();
                            // make sure question2 is not in the list of question 1 possibilities, ensures no deadlocks
                            $scope.question1Choices = SecretQuestionService.trimChoices(secretQuestionChoices, $scope.question2);
                            // make sure question1 is not in the list of question 2 possibilities, ensures no deadlocks
                            $scope.question2Choices = SecretQuestionService.trimChoices(secretQuestionChoices, $scope.question2);
                            passwordForm.isSubmitted = false;
                            promptPasswordModal.$promise.then(promptPasswordModal.hide);
                        },
                        function error(response) {
                            if (response.status === 403) {
                                passwordForm.password.$setValidity('correct', false);
                                $scope.showError();
                            }
                        });
                } else {
                    $scope.showError();
                }

            };

            $scope.onChangePassword = function (passwordForm) {
                passwordForm.password.$setValidity('correct', true);
                passwordForm.isSubmitted = false;
            };

            $scope.showError = function () {
                if (!$scope.errorAlert) {
                    $scope.errorAlert = $alert({
                        title: ' ',
                        content: 'Please check your password and try again.',
                        container: '#password-message-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                } else {
                    $scope.errorAlert.show();
                }
            };

            /**
             * Called when cancel is clicked.. takes the original
             * objects and copies them back into the bound objects.
             */
            $scope.cancel = function () {
                if (Session.secretQuestionCreated) {
                    $location.path('/viewSecurityQuestions').replace();
                } else {
                    $location.path('/').replace();
                }
            };

            $scope.secretQuestions = secretQuestionChoices;
            $scope.promptPassword();
        }])

;


