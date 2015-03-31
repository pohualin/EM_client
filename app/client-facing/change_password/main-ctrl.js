'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user's credentials have expired.
 */
    .controller('ChangePasswordController', ['$scope', '$location', '$alert', 'account', 'arrays', 'ChangePasswordService',
        function ($scope, $location, $alert, account, arrays, ChangePasswordService) {

            /**
             * Set the component up in its initial state.
             */
            $scope.reset = function () {
                $scope.passwordChange = ChangePasswordService.createChangeHolder();
                $scope.changePasswordFormSubmitted = false;
            };
            
            /**
             * clear bad validity for to avoid multiple error icons
             */
            $scope.oldPasswordChanged = function () {
                $scope.changePasswordForm.oldPassword.$setValidity('bad', true);
            };
            
            /**
             * method to make sure two new password fields match
             */
            $scope.passwordChanged = function () {
                var passwordChange = $scope.passwordChange;
                $scope.changePasswordForm.password.$setValidity('policy', true);
                $scope.changePasswordForm.password.$setValidity('history', true);
                $scope.changePasswordForm.password.$setValidity('eligibility', true);
                $scope.changePasswordForm.confirmPassword.$setValidity('same', passwordChange.password === passwordChange.confirmPassword);
            };

            /**
             * call server to save
             * handle 406 error to show particular error icon based on reason
             */
            $scope.save = function (changePasswordForm) {
                $scope.changePasswordFormSubmitted = true;
                changePasswordForm.oldPassword.$setValidity('bad', true);
                changePasswordForm.password.$setValidity('policy', true);
                changePasswordForm.password.$setValidity('history', true);
                changePasswordForm.password.$setValidity('eligibility', true);
                if (changePasswordForm.$valid) {
                    ChangePasswordService.changePassword($scope.account, $scope.passwordChange)
                        .then(function success() {
                            $alert({
                                content: 'The password for <b>' + account.login +
                                '</b> has been successfully changed.',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                            $location.path('/').replace();
                        }, function error(errorResponse) {
                            if (errorResponse.status === 403){
                                changePasswordForm.oldPassword.$setValidity('bad', false);
                            } else if (errorResponse.status === 406 && errorResponse.data) {
                                angular.forEach(errorResponse.data, function(validationError){
                                    if(validationError.entity.reason === 'DAYS_BETWEEN') {
                                        changePasswordForm.password.$setValidity('eligibility', false);
                                    } else if (validationError.entity.reason === 'POLICY') {
                                        changePasswordForm.password.$setValidity('policy', false);
                                    } else if (validationError.entity.reason === 'HISTORY') {
                                        changePasswordForm.password.$setValidity('history', false);
                                    }
                                });
                            }
                        });
                }
            };
            
            function init(){
                $scope.reset();
                ChangePasswordService.loadPolicy($scope.account.clientResource).then(function (response){
                    $scope.policy = response.data;
                });
            }
            
            init();
        }
    ])
;
