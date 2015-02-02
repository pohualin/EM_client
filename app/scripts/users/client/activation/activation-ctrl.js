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
                        content: 'User saved successfully. A setup email has been sent to  <b>' + UsersClientService.getUserClient().entity.email +
                        '</b>.',
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

