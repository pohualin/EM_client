'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
    .controller('ClientUsersEditorCtrl', ['$scope', 'Client',
        function ($scope, Client) {
            $scope.client = Client.getClient().entity;
            $scope.page.setTitle('Create Users - ' + $scope.client.name);
        }
    ])
;
