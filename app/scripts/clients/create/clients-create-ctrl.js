'use strict';

angular.module('emmiManager')

/**
 * Create new controller
 */
.controller('ClientCreateController', function ($scope, Client, $controller) {

    $controller('ViewEditCommon', {$scope: $scope});

    $scope.client = Client.newClient().entity;

    $scope.save = function (isValid) {
        $scope.formSubmitted = true;
        if (isValid && $scope.client.salesForceAccount) {
            Client.insertClient($scope.client).then(function (response) {
                Client.viewClient(response.data.entity);
            });
        } else {
            $scope.showError();
        }
    };

})

;