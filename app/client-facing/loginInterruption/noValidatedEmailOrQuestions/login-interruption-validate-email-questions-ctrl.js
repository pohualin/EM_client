'use strict';

angular.module('emmiManager')
    .controller('validateEmailQuestions', ['$scope', '$alert', '$location', '$controller', 'ValidationService', 'SecretQuestionService',
        function ($scope, $alert, $location, $controller, ValidationService, SecretQuestionService) {

            $scope.notValidatedEmailNoQuestionFormSubmitted = false;

            SecretQuestionService.getSecretQuestions().then(function (response) {
                $scope.secretQuestions = response.data.content;
            });

            $scope.account.question1 = SecretQuestionService.createNewResponse();
            $scope.account.question2 = SecretQuestionService.createNewResponse();

            $scope.saveNonValidatedEmailAndQuestions = function (isValid) {
                $scope.notValidatedEmailNoQuestionFormSubmitted = true;
                $scope.notValidatedEmailNoQuestionForm.validateEmail.$setValidity('duplicate', true);

                if (isValid) {
                    ValidationService.saveEmail($scope.account).then(function () {
                        //send validation email
                        ValidationService.sendValidationEmail($scope.account).then(function () {
                            SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.account.question1.entity, $scope.account.question2.entity).then(
                                function () {
                                    $location.path($scope.locationBeforeLogin).replace();
                                    $alert({
                                        content: 'Please check your email. A link has been sent to <strong>' + $scope.account.email +
                                            '</strong> to finish setting up your account.',
                                        type: 'success',
                                        placement: 'top',
                                        show: true,
                                        duration: 5,
                                        dismissable: true
                                    });
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
                                });

                        });
                    }, function () {
                        //server error
                        $scope.notValidatedEmailNoQuestionForm.validateEmail.$setValidity('duplicate', false);
                        if (!$scope.notValidateEmailErrorAlert) {
                            $scope.notValidateEmailErrorAlert = $alert({
                                title: ' ',
                                content: 'Please correct the below information.',
                                container: '#message-container-validate-email-no-question',
                                type: 'danger',
                                show: true,
                                dismissable: false
                            });
                        }
                    });
                } else {
                    $scope.notValidateEmailErrorAlert = $alert({
                        title: ' ',
                        content: 'Please correct the below information.',
                        container: '#message-container-validate-email-no-question',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
                }
            };

            /**
             * mark email as not a duplicate after the user changes the email
             */
            $scope.resetDuplicateValidityNotValidatedEmailAndQuestions = function () {
                $scope.notValidatedEmailNoQuestionForm.validateEmail.$setValidity('duplicate', true);
            };

            /**
             * When the save button is clicked. Check if the user
             * selected 2 same questions or not
             */
            $scope.onNotValidatedEmailAndQuestionsChange = function () {
                if (angular.equals($scope.account.question1.entity.secretQuestion, $scope.account.question2.entity.secretQuestion) && !(angular.isUndefined($scope.account.question1.entity.secretQuestion))) {
                    $scope.notValidatedEmailNoQuestionForm.secretQuestion2.$setValidity('duplicated', false);
                } else {
                    $scope.notValidatedEmailNoQuestionForm.secretQuestion2.$setValidity('duplicated', true);
                }
            };


            /**
             * functionality if user clicks not now
             */
            $scope.notNow = function () {
                $location.path($scope.locationBeforeLogin).replace();
            };
        }])
;

