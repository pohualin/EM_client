'use strict';

angular.module('emmiManager')

/**
 * This controller is used to impersonate an administrator at a client.
 */
    .controller('ImpersonationController', ['ImpersonationService', '$routeParams',
        function (ImpersonationService, $routeParams) {

            ImpersonationService.impersonate($routeParams.clientId, $routeParams.nextRoute);

        }
    ])

;
