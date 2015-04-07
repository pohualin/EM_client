//'use strict';
//
//angular.module('emmiManager')
//    .controller('enterEmail', ['$scope', 'NewEmailService','ValidationService', '$alert', '$location', 'account', 'locationBeforeLogin','$q',
//        function ($scope, NewEmailService, ValidationService, $alert, $location, account, locationBeforeLogin, $q) {
//            /**
//             * Send a validation email to the user
//             */
//            $scope.saveEmail = function (isValid) {
//                var deferred = $q.defer();
//                $scope.addEmailFormSubmitted = true;
//                $scope.addEmailForm.email.$setValidity('duplicate', true);
//                if (isValid) {
//                    //check if email is already in use and save email
//                    NewEmailService.saveEmail(account).then(function () {
//                        //send validation email
//                        ValidationService.sendValidationEmail(account).then(function (response) {
//                            deferred.resolve(response);
//                        });
//                    }, function () {
//                        //server error
//                        $scope.showEmailErrorAlert();
//                        $scope.addEmailForm.email.$setValidity('duplicate', false);
//                        deferred.reject();
//                    });
//                } else {
//                    //email doesn't match the matcher on email field or is blank
//                    $scope.showEmailErrorAlert();
//                    deferred.reject();
//                }
//                return deferred.promise;
//            };
//
//            $scope.showEmailErrorAlert = function () {
//                if (!$scope.emailErrorAlert) {
//                    $scope.emailErrorAlert = $alert({
//                        title: ' ',
//                        content: 'Please correct the below information.',
//                        container: '#message-container',
//                        type: 'danger',
//                        show: true,
//                        dismissable: false
//                    });
//                }
//            };
//
//            /**
//             * functionality if user clicks not now
//             */
//            $scope.notNow = function () {
//                $location.path(locationBeforeLogin).replace();
//            };
//
//            /**
//             * mark email as not a duplicate after the user changes the email
//             */
//            $scope.resetDuplicateValidity = function(){
//                $scope.addEmailForm.email.$setValidity('duplicate',true);
//            };
//        }]);