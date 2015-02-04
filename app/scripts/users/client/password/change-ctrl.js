'use strict';

angular.module('emmiManager')

/**
 * Change password controller
 */
    .controller('UsersClientPasswordController', ['$scope', 'UsersClientService', 'UsersClientPasswordService', '$alert', '$popover', 'API',
        function ($scope, UsersClientService, UsersClientPasswordService, $alert, $popover, API) {

            /**
             * Set the component up in its initial state.
             */
            $scope.reset = function () {
                $scope.passwordChange = UsersClientPasswordService.createChangeHolder();
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
             * Generates a password for a user and saves it.
             */
            $scope.generatePassword = function ($event) {
                $scope.passwordChange.password = UsersClientPasswordService.generatePassword();
                UsersClientPasswordService.changePassword(UsersClientService.getUserClient(), $scope.passwordChange)
                    .then(function success() {
                        if ($scope.passwordNotification) {
                            $scope.passwordNotification.hide();
                        }
                        $scope.login = UsersClientService.getUserClient().entity.login;
                        $scope.url = API.clientAppEntryUrl;
                        $scope.urlDisplay = $scope.url.substring($scope.url.indexOf("://") + 3);
                        $scope.passwordNotification = $popover(angular.element($event.currentTarget), {
                            scope: $scope,
                            placement: 'right',
                            trigger: 'manual',
                            template: 'partials/user/client/password/generate_popover.tpl.html',
                            show: true
                        });
                    });
            };

            /**
             * Generates a password for a user and saves it.
             */
            $scope.passwordReset = function () {
                UsersClientPasswordService.sendReset(UsersClientService.getUserClient()).then(function () {
                    $alert({
                        content: 'User saved successfully. A password reset email has been sent to  <b>' + UsersClientService.getUserClient().entity.email +
                        '</b>.',
                        type: 'success',
                        placement: 'top',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                });
            };


            /**
             * Saves a password change when the form is valid
             *
             * @param formValid true if the form is valid
             */
            $scope.save = function (formValid) {
                $scope.changePasswordFormSubmitted = true;
                if (formValid) {
                    UsersClientPasswordService.changePassword(UsersClientService.getUserClient(), $scope.passwordChange)
                        .then(function success() {
                            $scope.reset();
                            $alert({
                                content: 'The password for <b>' + UsersClientService.getUserClient().entity.login +
                                '</b> has been successfully saved.',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                        }, function error() {
                            $scope.reset();
                        });
                }
            };

            $scope.reset();
        }
    ])
;

