'use strict';

angular.module('emmiManager')
    .controller('sendValidationEmail', ['$scope', 'ValidationService', '$alert', '$location','$q',
        function ($scope, ValidationService, $alert, $location, $q) {
            //store original email
            ValidationService.get($scope.account).then(function (accountWithOriginalEmail) {
                $scope.account.originalUserClientEmail = accountWithOriginalEmail.originalUserClientEmail;
            });

            /**
             * Send a validation email to the user
             */
            $scope.sendValidationEmail = function (isValid) {
                var deferred = $q.defer();
                $scope.loginInterruptForm.validateEmail.$setValidity('duplicate',true);
                if(isValid) {
                    //check if email is already in use and save email
                    ValidationService.saveEmail($scope.account).then(
                        function() {
                            //send validation email
                            ValidationService.sendValidationEmail($scope.account).then(function (response) {
                                $scope.validateEmailSaveSuccesful = true;
                                deferred.resolve(response);
                            });
                        }, function() {
                            //server error
                            $scope.loginInterruptForm.validateEmail.$setValidity('duplicate',false);
                            deferred.reject();
                        });
                }else{
                    //email doesn't match the matcher on email field or is blank
                    deferred.reject();
                }
                return deferred.promise;
            };

            /**
             * mark email as not a duplicate after the user changes the email
             */
            $scope.resetDuplicateValidity = function(){
                $scope.loginInterruptForm.validateEmail.$setValidity('duplicate',true);
            };
        }])
;

