'use strict';

angular.module('emmiManager')

/**
 * Activation Controller
 */
    .controller('SupportActivationController', ['$scope', 'ActivationService', 'UsersClientService', '$alert', 'moment',
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
                $scope.whenSaving = true;
                ActivationService.expireActivation(UsersClientService.getUserClient())
                    .then(function () {
                        $scope.metadataChanged();
                    }).finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            /**
             * Send an activation email to the user
             */
            $scope.sendActivationEmail = function (addAnother) {
                $scope.whenSaving = true;
                ActivationService.sendActivationEmail(UsersClientService.getUserClient()).then(function () {
                    $scope.metadataChanged();
                    $alert({
                        content: 'A setup email has been sent to <strong>' + UsersClientService.getUserClient().entity.email + '</strong>.'
                    });
                    if(addAnother){
                        $scope.createAnotherUserClient();
                    }
                }).finally(function () {
                    $scope.whenSaving = false;
                });
            };
        }
    ])
;

