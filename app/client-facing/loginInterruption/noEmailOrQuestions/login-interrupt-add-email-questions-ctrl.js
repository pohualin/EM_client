'use strict';

angular.module('emmiManager')
    .controller('addEmailQuestions', ['$scope', '$alert', '$location', '$controller', 'NewEmailService','SecretQuestionService','EmailRestrictConfigurationsService','Session',
        function ($scope, $alert, $location, $controller, NewEmailService, SecretQuestionService, EmailRestrictConfigurationsService, Session) {
            $controller('SecretQuestionCreateLoginController', {$scope: $scope});
            $controller('enterEmail', {$scope: $scope});

            $scope.noEmailNoQuestionFormSubmitted = false;

            $scope.saveEmailThenQuestions = function (isValid) {
                $scope.noEmailNoQuestionFormSubmitted = true;
                $scope.noEmailNoQuestionForm.addEmail.$setValidity('duplicate', true);

                if (isValid) {
                    $scope.whenSaving = true;
                    NewEmailService.saveEmail($scope.userClientReqdResource,Session.password).then(function () {
                        return SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.userClientReqdResource.question1.entity, $scope.userClientReqdResource.question2.entity).then(
                            function () {
                                $location.path($scope.locationBeforeLogin).replace();
                                if (!$scope.emailErrorAlert) {
                                    $alert({
                                        content: 'Your security questions have been updated successfully.'
                                    });

                                    $alert({
                                        content: 'Please check your email. A verification  link has been sent to <strong>' + $scope.userClientReqdResource.email +
                                            '</strong> to finish setting up your account.'
                                    });
                                }
                            });
                    }, function (error) {
                        //server error
                        if (error.conflicts) {
                            $scope.noEmailNoQuestionForm.addEmail.$setValidity('duplicate', false);
                            $scope.emailError = error.conflicts[0];
                        }
                        if (error.validationError) {
                            EmailRestrictConfigurationsService.allValidEmailEndings($scope.account).then(function (response) {
                                error.validationError.validEmailEndings = response;
                                $scope.emailError = error.validationError;
                            });
                        }

                        if (!$scope.noEmailNoQuestionAlert) {
                            $scope.noEmailNoQuestionAlert = $alert({
                                content: 'Please correct the below information.',
                                container: '#message-container',
                                type: 'danger',
                                show: true,
                                placement: '',
                                duration: false,
                                dismissable: false
                            });
                        }

                    }).finally(function () {
                        $scope.whenSaving = false;
                    });
                }else{
                    if (!$scope.noEmailNoQuestionAlert) {
                        $scope.noEmailNoQuestionAlert = $alert({
                            content: 'Please correct the below information.',
                            container: '#message-container',
                            type: 'danger',
                            show: true,
                            placement: '',
                            duration: false,
                            dismissable: false
                        });
                    }
                }
            };


            /**
             * mark email as not a duplicate after the user changes the email
             */
            $scope.resetDuplicateValidityEmailAndQuestions = function () {
                $scope.noEmailNoQuestionForm.addEmail.$setValidity('duplicate', true);
            };

            /**
             * When the save button is clicked. Check if the user
             * selected 2 same questions or not
             */
            $scope.onChange = function () {
                if (angular.equals($scope.userClientReqdResource.question1.entity.secretQuestion, $scope.userClientReqdResource.question2.entity.secretQuestion) && !(angular.isUndefined($scope.userClientReqdResource.question1.entity.secretQuestion))) {
                    $scope.noEmailNoQuestionForm.secretQuestion2.$setValidity('duplicated', false);
                } else {
                    $scope.noEmailNoQuestionForm.secretQuestion2.$setValidity('duplicated', true);
                }
            };

            /**
             * functionality if user clicks not now
             */
            $scope.notNow = function () {
                $scope.whenSaving = true;
                NewEmailService.notNow($scope.userClientReqdResource).finally(function () {
                    $scope.whenSaving = false;
                });
                $location.path($scope.locationBeforeLogin).replace();
            };
        }
    ])
;

