'use strict';

angular.module('emmiManager')

/**
 *  Edit a single client
 */
    .controller('ClientDetailCtrl', function ($scope, Client, $controller, Location, clientResource, Tag, $q, focus) {

        $controller('ViewEditCommon', {$scope: $scope});

        if (clientResource) {
            $scope.client = clientResource.entity; //for the view state
            Client.setClient(clientResource);
        } else {
            Client.viewClientList();
        }

        $scope.cancel = function () {
            $scope.editMode = false;
            delete $scope.clientToEdit;
        };

        $scope.cancelTagsAndLocations = function () {
            Client.viewClientList();
        };

        $scope.edit = function () {
            $scope.editMode = true;
            $scope.clientToEdit = angular.copy($scope.client);
            focus('clientName');
        };

        $scope.save = function (isValid) {
            $scope.metadataSubmitted = true;
            if (isValid && $scope.clientToEdit.salesForceAccount) {
                Client.updateClient($scope.clientToEdit).then(function () {
                    $scope.editMode = false;
                });
            } else {
                $scope.showError();
            }
        };

        $scope.saveTagsAndLocations = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid) {
                var insertGroups = Tag.insertGroups(Client.getClient()),
                    updateLocation = Location.updateForClient(Client.getClient());
                $q.all([insertGroups, updateLocation]);
            } else {
                $scope.showError();
            }
        };
    })
;