'use strict';

angular.module('emmiManager')
    .controller('addEmailQuestions', ['$scope', '$alert', '$location', '$controller', 'NewEmailService','SecretQuestionService',
        function ($scope, $alert, $location, $controller, NewEmailService, SecretQuestionService ) {
            $controller('SecretQuestionCreateController', {$scope: $scope});
            $controller('enterEmail', {$scope: $scope});

            $scope.noEmailNoQuestionFormSubmitted = false;

            $scope.saveEmailThenQuestions = function (isValid) {
                $scope.noEmailNoQuestionFormSubmitted = true;
                $scope.noEmailNoQuestionForm.addEmail.$setValidity('duplicate', true);

                if (isValid) {
                    NewEmailService.saveEmail($scope.account).then(function () {
                        SecretQuestionService.saveOrUpdateSecretQuestionResponse($scope.account.question1.entity, $scope.account.question2.entity).then(
                            function () {
                                $location.path($scope.locationBeforeLogin).replace();
                                if (!$scope.emailErrorAlert) {
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

                                    $alert({
                                        content: 'Please check your email. A verification  link has been sent to <strong>' + $scope.account.email +
                                            '</strong> to finish setting up your account.',
                                        type: 'success',
                                        placement: 'top',
                                        show: true,
                                        duration: 5,
                                        dismissable: true
                                    });
                                }
                            });
                    }, function () {
                        //server error
                        $scope.noEmailNoQuestionForm.addEmail.$setValidity('duplicate', false);
                        if (!$scope.noEmailNoQuestionAlert) {
                            $scope.noEmailNoQuestionAlert = $alert({
                                title: ' ',
                                content: 'Please correct the below information.',
                                container: '#message-container',
                                type: 'danger',
                                show: true,
                                dismissable: false
                            });
                        }

                    });
                }else{
                    $scope.noEmailNoQuestionAlert = $alert({
                        title: ' ',
                        content: 'Please correct the below information.',
                        container: '#message-container',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });
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
                if (angular.equals($scope.account.question1.entity.secretQuestion, $scope.account.question2.entity.secretQuestion) && !(angular.isUndefined($scope.account.question1.entity.secretQuestion))) {
                    $scope.noEmailNoQuestionForm.secretQuestion2.$setValidity('duplicated', false);
                } else {
                    $scope.noEmailNoQuestionForm.secretQuestion2.$setValidity('duplicated', true);
                }
            };

            /**
             * functionality if user clicks not now
             */
            $scope.notNow = function () {
                $location.path($scope.locationBeforeLogin).replace();
            };
        }
    ])
;
