'use strict';

angular.module('emmiManager')
    .controller('sendValidationEmail', ['$scope', 'ValidationService', '$alert', '$location', 'account', 'locationBeforeLogin',
        function ($scope, ValidationService, $alert, $location, account, locationBeforeLogin) {
            //store original email
            ValidationService.get(account).then(function (accountWithOriginalEmail) {
                account.originalUserClientEmail = accountWithOriginalEmail.originalUserClientEmail;
            });

            /**
             * Send a validation email to the user
             */
            $scope.sendValidationEmail = function (isValid) {
                $scope.editEmailFormSubmitted=true;
                $scope.editEmailForm.email.$setValidity('duplicate',true);
                if(isValid) {
                    //check if email is already in use and save email
                    ValidationService.saveEmail(account).then(
                        function() {
                            //send validation email
                            ValidationService.sendValidationEmail(account).then(function () {
                                $location.path(locationBeforeLogin).replace();
                                //show confirmation banner
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
                        }, function() {
                            //server error
                            $scope.showEmailErrorAlert();
                            $scope.editEmailForm.email.$setValidity('duplicate',false);
                        });
                }else{
                    //email doesn't match the matcher on email field or is blank
                    $scope.showEmailErrorAlert();
                }
            };

            $scope.showEmailErrorAlert = function() {
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
                $location.path(locationBeforeLogin).replace();
            };

            /**
             * mark email as not a duplicate after the user changes the email
             */
            $scope.resetDuplicateValidity = function(){
                $scope.editEmailForm.email.$setValidity('duplicate',true);
            };
        }])
;

