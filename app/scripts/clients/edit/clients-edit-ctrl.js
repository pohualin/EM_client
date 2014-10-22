'use strict';

angular.module('emmiManager')

/**
 *  Edit a single client
 */
    .controller('ClientDetailCtrl', function ($scope, Client, $controller, Location, clientResource, Tag, $q) {

        $controller('ViewEditCommon', {$scope: $scope});

        if (clientResource) {
            $scope.client = clientResource.entity;
            clientResource.currentlyActive = clientResource.entity.active;
        } else {
            Client.viewClientList();
        }

        $scope.cancel = function () {
            $scope.editMode = false;
        };

        $scope.cancelTagsAndLocations = function () {
            Client.viewClientList();
        };

        $scope.edit = function () {
            $scope.editMode = true;
        };

        $scope.save = function (isValid) {
            $scope.metadataSubmitted = true;
            if (isValid && $scope.client.salesForceAccount) {
                Client.updateClient($scope.client).then(function () {
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