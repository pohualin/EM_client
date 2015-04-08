'use strict';

angular.module('emmiManager')
    .controller('enterEmail', ['$scope', 'NewEmailService', 'ValidationService', '$alert', '$location', 'EmailRestrictConfigurationsService',
        function ($scope, NewEmailService, ValidationService, $alert, $location, EmailRestrictConfigurationsService) {
            $scope.enterEmailFormSubmitted = false;

            /**
             * Send a validation email to the user
             */
            $scope.saveEmail = function (isValid) {
                $scope.enterEmailFormSubmitted = true;
                $scope.enterEmailForm.addEmail.$setValidity('duplicate', true);
                if (isValid) {
                    //check if email is already in use and save email
                    NewEmailService.saveEmail($scope.account).then(function () {
                        //send validation email
                        ValidationService.sendValidationEmail($scope.account).then(function () {
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


                        });
                    }, function (error) {
                        //server error.
                        if (error.conflicts) {
                            $scope.enterEmailForm.addEmail.$setValidity('duplicate', false);
                        }
                        if (error.validationError) {
                            EmailRestrictConfigurationsService.allValidEmailEndings($scope.account).then(function (response) {
                                error.validationError.validEmailEndings = response;
                                $scope.emailError = error.validationError;
                            });
                        }
                        //error function
                        if (!$scope.emailErrorAlert) {
                            $scope.emailErrorAlert = $alert({
                                title: ' ',
                                content: 'Please correct the below information.',
                                container: '#message-container-no-email',
                                type: 'danger',
                                show: true,
                                dismissable: false
                            });
                        }
                    });
                } else {
                    //email doesn't match the matcher on email field or is blank
                    //error function
                    if (!$scope.emailErrorAlert) {
                        $scope.emailErrorAlert = $alert({
                            title: ' ',
                            content: 'Please correct the below information.',
                            container: '#message-container-no-email',
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
            $scope.resetDuplicateValidity = function () {
                $scope.enterEmailForm.addEmail.$setValidity('duplicate', true);
            };
        }]);