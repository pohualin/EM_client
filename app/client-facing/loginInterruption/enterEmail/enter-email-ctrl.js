'use strict';

angular.module('emmiManager')
    .controller('enterEmail', ['$scope', 'NewEmailService', 'ValidationService', '$alert', '$location', '$q',
        function ($scope, NewEmailService, ValidationService, $alert, $location, $q) {
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
                        $scope.enterEmailForm.addEmail.$setValidity('duplicate', false);
//                        if (error.status === 406 && error.data && error.data.conflicts) {
//                            $scope.enterEmailForm.addEmail.$setValidity('duplicate', true);
//                        }
//                        if (error.status === 406 && error.data && error.data.validationError) {
//                            EmailRestrictConfigurationsService.allValidEmailEndings().then(function (response) {
//                                error.data.validationError.validEmailEndings = response;
//                                $scope.emailError = error.data.validationError;
//                            });
//                            $scope.formValidationError();
//                        }
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