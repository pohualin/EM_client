'use strict';

angular.module('emmiManager')
    .controller('enterEmail', ['$scope', 'NewEmailService', 'ValidationService', '$alert', '$location', 'EmailRestrictConfigurationsService','Session',
        function ($scope, NewEmailService, ValidationService, $alert, $location, EmailRestrictConfigurationsService,Session) {
            $scope.enterEmailFormSubmitted = false;

            /**
             * Send a validation email to the user
             */
            $scope.saveEmail = function (isValid) {
                $scope.enterEmailFormSubmitted = true;
                $scope.enterEmailForm.addEmail.$setValidity('duplicate', true);
                if (isValid) {
                    //check if email is already in use and save email
                    $scope.whenSaving = true;
                    NewEmailService.saveEmail($scope.userClientReqdResource,Session.password).then(function () {
                        //send validation email
                        ValidationService.sendValidationEmail($scope.userClientReqdResource).then(function () {
                            $location.path($scope.locationBeforeLogin).replace();

                            $alert({
                                content: 'Please check your email. A link has been sent to <strong>' + $scope.userClientReqdResource.email +
                                    '</strong> to finish setting up your account.'
                            });


                        });
                    }, function (error) {
                        //server error.
                        if (error.conflicts) {
                            $scope.enterEmailForm.addEmail.$setValidity('duplicate', false);
                            $scope.emailError = error.conflicts[0];
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
                                content: 'Please correct the below information.',
                                container: '#message-container-no-email',
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
                } else {
                    //email doesn't match the matcher on email field or is blank
                    //error function
                    if (!$scope.emailErrorAlert) {
                        $scope.emailErrorAlert = $alert({
                            content: 'Please correct the below information.',
                            container: '#message-container-no-email',
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
            $scope.resetDuplicateValidity = function () {
                $scope.enterEmailForm.addEmail.$setValidity('duplicate', true);
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
        }]);
