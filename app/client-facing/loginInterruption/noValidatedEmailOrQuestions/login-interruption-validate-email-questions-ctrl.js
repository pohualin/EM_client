'use strict';

angular.module('emmiManager')
    .controller('validateEmailQuestions', ['$scope', '$alert', '$location', '$controller', 'ValidationService', 'SecretQuestionService', 'EmailRestrictConfigurationsService',
        function ($scope, $alert, $location, $controller, ValidationService, SecretQuestionService, EmailRestrictConfigurationsService) {

            $scope.notValidatedEmailNoQuestionFormSubmitted = false;

            SecretQuestionService.getSecretQuestions().then(function (response) {
                $scope.secretQuestions = response.data.content;
            });

            $scope.userClientReqdResource.question1 = SecretQuestionService.createNewResponse();
            $scope.userClientReqdResource.question2 = SecretQuestionService.createNewResponse();

            $scope.saveNonValidatedEmailAndQuestions = function (isValid) {
                $scope.notValidatedEmailNoQuestionFormSubmitted = true;
                $scope.notValidatedEmailNoQuestionForm.validateEmail.$setValidity('duplicate', true);

                if (isValid) {
                    ValidationService.saveEmail($scope.userClientReqdResource,$scope.userData.password).then(function () {
                        //send validation email
                        ValidationService.sendValidationEmail($scope.userClientReqdResource).then(function () {
                            SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.userClientReqdResource.question1.entity, $scope.userClientReqdResource.question2.entity).then(
                                function () {
                                    $location.path($scope.locationBeforeLogin).replace();
                                    $alert({
                                        content: 'Please check your email. A link has been sent to <strong>' + $scope.userClientReqdResource.email +
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
                    }, function (error) {
                        //server error
                        if (error.conflicts) {
                            $scope.notValidatedEmailNoQuestionForm.validateEmail.$setValidity('duplicate', false);
                        }
                        if (error.validationError) {
                            EmailRestrictConfigurationsService.allValidEmailEndings($scope.account).then(function (response) {
                                error.validationError.validEmailEndings = response;
                                $scope.emailError = error.validationError;
                            });
                        }

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
                if (angular.equals($scope.userClientReqdResource.question1.entity.secretQuestion, $scope.userClientReqdResource.question2.entity.secretQuestion) && !(angular.isUndefined($scope.userClientReqdResource.question1.entity.secretQuestion))) {
                    $scope.notValidatedEmailNoQuestionForm.secretQuestion2.$setValidity('duplicated', false);
                } else {
                    $scope.notValidatedEmailNoQuestionForm.secretQuestion2.$setValidity('duplicated', true);
                }
            };


            /**
             * functionality if user clicks not now
             */
            $scope.notNow = function () {
                ValidationService.notNow($scope.userClientReqdResource);
                $location.path($scope.locationBeforeLogin).replace();
            };
        }])
;

