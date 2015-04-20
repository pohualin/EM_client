'use strict';

angular.module('emmiManager')
    .controller('sendValidationEmail', ['$scope', 'ValidationService', '$alert', '$location', 'EmailRestrictConfigurationsService',
        function ($scope, ValidationService, $alert, $location, EmailRestrictConfigurationsService) {
            //store original email
            ValidationService.get($scope.userClientReqdResource).then(function (accountWithOriginalEmail) {
                $scope.userClientReqdResource.originalUserClientEmail = accountWithOriginalEmail.originalUserClientEmail;
            });

            $scope.validateEmailFormSubmitted = false;

            /**
             * Send a validation email to the user
             */
            $scope.sendValidationEmail = function (isValid) {
                $scope.validateEmailFormSubmitted = true;
                $scope.validateEmailForm.validateEmail.$setValidity('duplicate', true);
                if (isValid) {
                    //check if email is already in use and save email
                    ValidationService.saveEmail($scope.userClientReqdResource).then(
                        function () {
                            //send validation email
                            ValidationService.sendValidationEmail($scope.userClientReqdResource).then(function () {
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
                            });

                        }, function (error) {
                            //server error
                            if (error.conflicts) {
                                $scope.validateEmailForm.validateEmail.$setValidity('duplicate', false);
                            }
                            if (error.validationError) {
                                EmailRestrictConfigurationsService.allValidEmailEndings($scope.account).then(function (response) {
                                    error.validationError.validEmailEndings = response;
                                    $scope.emailError = error.validationError;
                                });
                            }
                            if (!$scope.validateEmailErrorAlert) {
                                $scope.validateEmailErrorAlert = $alert({
                                    title: ' ',
                                    content: 'Please correct the below information.',
                                    container: '#message-container-validate-email',
                                    type: 'danger',
                                    show: true,
                                    dismissable: false
                                });
                            }

                        });
                } else {
                    //email doesn't match the matcher on email field or is blank
                    if (!$scope.validateEmailErrorAlert) {
                        $scope.validateEmailErrorAlert = $alert({
                            title: ' ',
                            content: 'Please correct the below information.',
                            container: '#message-container-validate-email',
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
                $scope.validateEmailForm.validateEmail.$setValidity('duplicate', true);
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

