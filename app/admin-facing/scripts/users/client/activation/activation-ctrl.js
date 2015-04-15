'use strict';

angular.module('emmiManager')

/**
 * Activation Controller
 */
    .controller('ActivationController', ['$scope', 'ActivationService', 'UsersClientService', '$alert', 'moment',
        function ($scope, ActivationService, UsersClientService, $alert, moment) {

            /**
             * Determines if the activation expiration date is before now
             * @returns {*}
             */
            $scope.inThePast = function () {
                return moment($scope.selectedUserClient.entity.activationExpirationDateTime + 'Z').isBefore();
            };

            /**
             * Expires an activation token
             */
            $scope.expireNow = function () {
                ActivationService.expireActivation(UsersClientService.getUserClient())
                    .then(function () {
                        $scope.metadataChanged();
                    });
            };

            /**
             * Send an activation email to the user
             */
            $scope.sendActivationEmail = function () {
                ActivationService.sendActivationEmail(UsersClientService.getUserClient()).then(function () {
                    $scope.metadataChanged();
                    $alert({
                        content: 'A setup email has been sent to <strong>' + UsersClientService.getUserClient().entity.email +
                        '</strong>.',
                        container: '#messages-container',
                        type: 'success',
                        placement: 'top',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                });
            };
        }
    ])
;

