'use strict';

angular.module('emmiManager')

/**
 * Create new controller
 */
.controller('ClientCreateController', function ($scope, Client, $controller, Location) {

    $controller('ViewEditCommon', {$scope: $scope});

    $scope.client = Client.newClient().entity;

    $scope.saveUpdate = function (isValid) {
        // this will get called if the client form saves but any child calls fail
        $scope.formSubmitted = true;
        if (isValid && $scope.client.salesForceAccount) {
            Client.updateClient($scope.client).then(function () {
                // update locations for the client
                Location.updateForClient(Client.getClient()).then(function () {
                    Client.viewClient($scope.client);
                });
            });
        } else {
            $scope.showError();
        }
    };

    $scope.save = function (isValid) {
        $scope.formSubmitted = true;
        if (isValid && $scope.client.salesForceAccount) {
            Client.insertClient($scope.client).then(function (response) {
                Client.editClient(response.data.entity);
            });
        } else {
            $scope.showError();
        }
    };

})

;