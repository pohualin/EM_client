'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
    .controller('ManageClientUsersMainCtrl', ['$scope', 'Client',
        function ($scope, Client) {
            $scope.client = Client.getClient().entity;
            $scope.page.setTitle('Manage Users - ' + $scope.client.name);
        }
    ])
;
