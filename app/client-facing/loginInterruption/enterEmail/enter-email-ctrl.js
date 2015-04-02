'use strict';

angular.module('emmiManager')
    .controller('enterEmail', ['$scope', 'NewEmailService','ValidationService', '$alert', '$location','$q',
        function ($scope, NewEmailService, ValidationService, $alert, $location,$q) {
            /**
             * Send a validation email to the user
             */
            $scope.saveEmail = function (isValid) {
                var deferred = $q.defer();
                $scope.loginInterruptForm.addEmail.$setValidity('duplicate', true);
                if (isValid) {
                    //check if email is already in use and save email
                    NewEmailService.saveEmail($scope.account).then(function () {
                        //send validation email
                        ValidationService.sendValidationEmail($scope.account).then(function (response) {
                            $scope.addEmailSaveSuccesful = true;
                            deferred.resolve(response);
                        });
                    }, function () {
                        //server error
                        $scope.loginInterruptForm.addEmail.$setValidity('duplicate', false);
                        deferred.reject();
                    });
                } else {
                    //email doesn't match the matcher on email field or is blank
                    $scope.showEmailErrorAlert();
                    deferred.reject();
                }
                return deferred.promise;
            };
            /**
             * mark email as not a duplicate after the user changes the email
             */
            $scope.resetDuplicateValidity = function(){
                $scope.loginInterruptForm.addEmail.$setValidity('duplicate',true);
            };
        }]);