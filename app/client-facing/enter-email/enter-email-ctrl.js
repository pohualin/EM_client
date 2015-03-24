'use strict';

angular.module('emmiManager')
    .controller('enterEmail', ['$scope', 'NewEmailService','ValidationService', '$alert', '$location', 'account', 'locationBeforeLogin',
        function ($scope, NewEmailService, ValidationService, $alert, $location, account, locationBeforeLogin) {
            /**
             * Send a validation email to the user
             */
            $scope.saveEmail = function (isValid) {
                $scope.addEmailFormSubmitted = true;
                $scope.addEmailForm.email.$setValidity('duplicate', true);
                if (isValid) {
                    //check if email is already in use and save email
                    NewEmailService.saveEmail(account).then(function () {
                        //send validation email
                        ValidationService.sendValidationEmail(account).then(function () {
                            $location.path(locationBeforeLogin).replace();
                            //show confirmation banner
                            $alert({
                                content: 'Please check your email. A verification  link has been sent to <strong>' + $scope.account.email +
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
                        $scope.showEmailErrorAlert();
                        $scope.addEmailForm.email.$setValidity('duplicate', false);
                    });
                } else {
                    //email doesn't match the matcher on email field or is blank
                    $scope.showEmailErrorAlert();
                }
            };

            $scope.showEmailErrorAlert = function () {
                if (!$scope.emailErrorAlert) {
                    $scope.emailErrorAlert = $alert({
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
             * functionality if user clicks not now
             */
            $scope.notNow = function () {
                NewEmailService.notNow(account);
                $location.path(locationBeforeLogin).replace();
            };

            /**
             * mark email as not a duplicate after the user changes the email
             */
            $scope.resetDuplicateValidity = function(){
                $scope.addEmailForm.email.$setValidity('duplicate',true);
            };
        }]);