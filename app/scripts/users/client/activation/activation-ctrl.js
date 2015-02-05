'use strict';

angular.module('emmiManager')

/**
 * Activation Controller
 */
    .controller('ActivationController', ['$scope', 'ActivationService', 'UsersClientService', '$alert',
        function ($scope, ActivationService, UsersClientService, $alert) {

            $scope.sendActivationEmail = function () {
                ActivationService.sendActivationEmail(UsersClientService.getUserClient()).then(function () {
                    $alert({
                        content: 'A setup email has been sent to <strong>' + UsersClientService.getUserClient().entity.email +
                        '</strong>.',
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

