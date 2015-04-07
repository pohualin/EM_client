'use strict';

angular.module('emmiManager')
    .controller('sendValidationEmail', ['$scope', 'ValidationService', '$alert', '$location',
        function ($scope, ValidationService, $alert, $location) {
            //store original email
            ValidationService.get($scope.account).then(function (accountWithOriginalEmail) {
                $scope.account.originalUserClientEmail = accountWithOriginalEmail.originalUserClientEmail;
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
                    ValidationService.saveEmail($scope.account).then(
                        function () {
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

                        }, function () {
                            //server error
                            $scope.validateEmailForm.validateEmail.$setValidity('duplicate', false);

                            $scope.validateEmailErrorAlert = $alert({
                                title: ' ',
                                content: 'Please correct the below information.',
                                container: '#message-container-validate-email',
                                type: 'danger',
                                show: true,
                                dismissable: false
                            });

                        });
                } else {
                    //email doesn't match the matcher on email field or is blank

                    $scope.validateEmailErrorAlert = $alert({
                        title: ' ',
                        content: 'Please correct the below information.',
                        container: '#message-container-validate-email',
                        type: 'danger',
                        show: true,
                        dismissable: false
                    });

                }
            };

            /**
             * mark email as not a duplicate after the user changes the email
             */
            $scope.resetDuplicateValidity = function () {
                $scope.validateEmailForm.validateEmail.$setValidity('duplicate', true);
            };
        }])
;

