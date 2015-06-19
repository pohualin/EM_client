'use strict';

angular.module('emmiManager')

/**
 * Change password controller
 */
    .controller('UsersClientPasswordController', ['$scope', 'UsersClientService', 'UsersClientPasswordService', '$alert', '$popover', 'API', 'moment',
        function ($scope, UsersClientService, UsersClientPasswordService, $alert, $popover, API, moment) {

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
             * Called when the x button is clicked in the popover
             */
            $scope.closePopover = function () {
                $scope.passwordNotification.$promise.then($scope.passwordNotification.destroy);
                delete $scope.passwordNotification;
            };

            /**
             * checks if the password reset expiration is before now
             * @returns {*}
             */
            $scope.inThePast = function () {
                return moment($scope.selectedUserClient.entity.passwordResetExpirationDateTime + 'Z').isBefore();
            };

            /**
             * Generates a password for a user and saves it.
             */
            $scope.generatePassword = function ($event) {
                $scope.passwordChange.password = UsersClientPasswordService.generatePassword();
                $scope.whenSaving = true;
                UsersClientPasswordService.changePassword(UsersClientService.getUserClient(), $scope.passwordChange)
                    .then(function success() {
                        if ($scope.passwordNotification) {
                            $scope.passwordNotification.hide();
                        }
                        $scope.metadataChanged();
                        $scope.login = UsersClientService.getUserClient().entity.login;
                        $scope.url = API.clientAppEntryUrl;
                        var idx = $scope.url.indexOf('://') + 3;
                        $scope.urlDisplay = idx > 2 ? $scope.url.substring(idx) : $scope.url;

                        $scope.passwordNotification = $popover(angular.element($event.currentTarget), {
                            scope: $scope,
                            placement: 'right',
                            trigger: 'manual',
                            template: 'admin-facing/partials/user/client/password/generate_popover.tpl.html',
                            show: true
                        });

                    }).finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            /**
             * Expire the password reset token
             */
            $scope.expireNow = function () {
                $scope.whenSaving = true;
                UsersClientPasswordService.expireReset(UsersClientService.getUserClient())
                    .then(function () {
                        $scope.metadataChanged();
                    }).finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            /**
             * Generates a password for a user and saves it.
             */
            $scope.passwordReset = function () {
                $scope.whenSaving = true;
                UsersClientPasswordService.sendReset(UsersClientService.getUserClient()).then(function () {
                    $scope.metadataChanged();
                    $alert({
                        content: 'A password reset email has been sent to <strong>' + UsersClientService.getUserClient().entity.email + '</strong>.'
                    });
                }).finally(function () {
                    $scope.whenSaving = false;
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
                    $scope.whenSaving = true;
                    UsersClientPasswordService.changePassword(UsersClientService.getUserClient(), $scope.passwordChange)
                        .then(function success() {
                            $scope.reset();
                            $alert({
                                content: 'The password for <b>' + UsersClientService.getUserClient().entity.login + '</b> has been successfully saved.'
                            });
                        }, function error() {
                            $scope.reset();
                        }).finally(function () {
                            $scope.whenSaving = false;
                        });
                }
            };

            $scope.reset();
        }
    ])
;

