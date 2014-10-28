'use strict';

angular.module('emmiManager')

/**
 *   Controls the existing locations section (partials/location/client_current.html)
 */
    .controller('ClientLocationsController', function ($scope, Location, $http, Session, UriTemplate, $controller, $modal, Client, $alert) {

        $controller('LocationCommon', {$scope: $scope});

        $controller('CommonPagination', {$scope: $scope});

        $scope.pageSizes = [5, 10, 15, 25];

        var editLocationModal = $modal({scope: $scope, template: 'partials/client/location/edit.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

        $scope.editLocation = function (location) {
            // create a copy for editing
            $scope.location = angular.copy(location);

            // save the original for overlay if save is clicked
            $scope.originalLocation = location;

            // set belongsTo property
            $scope.setBelongsToPropertiesFor($scope.location);

            // show the dialog box
            editLocationModal.$promise.then(editLocationModal.show);
        };

        var contentProperty = 'clientLocations';

        $scope.performSearch = function(pageSize){
            $scope.loading = true;
            Location.findForClient(Client.getClient(), pageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, contentProperty);
            }, function () {
                // error happened
                console.log('Error loading locations for a client');
                $scope.loading = false;
            });
        };

        $scope.showRemovalSuccess = function (locationResource) {
            $alert({
                title: ' ',
                content: 'The location <b>' + locationResource.location.entity.name + '</b> has been successfully removed.',
                container: '#remove-container',
                type: 'success',
                show: true,
                duration: 5,
                dismissable: true
            });
        };

        $scope.removeExistingLocation = function (locationResource) {
            Location.removeLocation(locationResource).then(function () {
                $scope.showRemovalSuccess(locationResource);
                $scope.performSearch();
            });
        };

        // when a page size link is used
        $scope.changePageSize = function (pageSize) {
            $scope.performSearch(pageSize);
        };

        // when a pagination link is used
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            Location.fetchPageLink(href).then(function (clientPage) {
                $scope.handleResponse(clientPage, contentProperty);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.performSearch();
    })
;