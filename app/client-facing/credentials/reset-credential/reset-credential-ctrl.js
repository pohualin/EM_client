'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user's credentials have expired.
 */
    .controller('CredentialsResetController', ['$scope', '$location', '$alert', 'account', 'arrays', 'CredentialsResetService',
        function ($scope, $location, $alert, account, arrays, CredentialsResetService) {

            /**
             * Set the component up in its initial state.
             */
            $scope.reset = function () {
                $scope.passwordChange = CredentialsResetService.createChangeHolder();
                $scope.changePasswordFormSubmitted = false;
            };

            /**
             * Compares the two password fields then sets a 'same' validity if the two passwords are identical
             */
            $scope.passwordChanged = function () {
                var passwordChange = $scope.passwordChange;
                $scope.changePasswordForm.confirmPassword.$setValidity('same', passwordChange.password === passwordChange.confirmPassword);
            };

            /**
             * Saves a password change when the form is valid
             *
             * @param formValid true if the form is valid
             */
            $scope.save = function (changePasswordForm) {
                $scope.changePasswordFormSubmitted = true;
                changePasswordForm.password.$setValidity('policy', true);
                if (changePasswordForm.$valid) {
                    CredentialsResetService.expiredPassword(credentials, $scope.passwordChange)
                        .then(function success() {
                            $alert({
                                content: 'The password for <b>' + credentials.username +
                                '</b> has been successfully changed.',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                            $location.path('/').replace();
                        }, function error(errorResponse) {
                            if (errorResponse.status === 406) {
                                changePasswordForm.password.$setValidity('policy', false);
                            } else {
                                $location.path('/credentials/expired/failure').replace();
                            }
                        });
                }
            };

            function init(){
                $scope.reset();
                account.clientResource.link = arrays.convertToObject('rel', 'href',
                        account.clientResource.link);
                CredentialsResetService.loadPolicy(account.clientResource).then(function (response){
                    $scope.policy = response.data;
                });
            }
            
            init();
        }
    ])
;
