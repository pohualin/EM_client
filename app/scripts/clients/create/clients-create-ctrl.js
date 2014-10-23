'use strict';

angular.module('emmiManager')

/**
 * Create new controller
 */
.controller('ClientCreateController', function ($scope, Client, $controller) {

    $controller('ViewEditCommon', {$scope: $scope});

    $scope.clientToEdit = Client.newClient().entity;

    $scope.save = function (isValid) {
        $scope.formSubmitted = true;
        if (isValid && $scope.clientToEdit.salesForceAccount) {
            Client.insertClient($scope.clientToEdit).then(function (response) {
                Client.viewClient(response.data.entity);
            });
        } else {
            $scope.showError();
        }
    };

})

;