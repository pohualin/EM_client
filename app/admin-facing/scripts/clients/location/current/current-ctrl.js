'use strict';

angular.module('emmiManager')

/**
 *   Controls the existing locations section (admin-facing/partials/location/client_current.html)
 */
    .controller('ClientLocationsController', function ($scope, Location, $http, Session, UriTemplate, $controller, $modal, Client, $alert) {

        $controller('LocationCommon', {$scope: $scope});

        $controller('CommonPagination', {$scope: $scope});

        $scope.pageSizes = [5, 10, 15, 25];

        var editLocationModal = $modal({scope: $scope, template: 'admin-facing/partials/client/location/edit.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, backdrop: 'static'});

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

        $scope.openDeletePopover = function (location) {
            location.deleting = true;
        };

        $scope.closeDeletePopover = function (location) {
            location.deleting = false;
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
                content: 'The location <b>' + locationResource.location.entity.name + '</b> has been successfully removed.'
            });
        };

        $scope.removeExistingLocation = function (locationResource) {
            $scope.whenSaving = true;
            Location.removeLocation(locationResource).then(function () {
                $scope.showRemovalSuccess(locationResource);
                $scope.performSearch();
            }).finally(function () {
                $scope.whenSaving = false;
            });
            _paq.push(['trackEvent', 'Form Action', 'Client Location', 'Remove']);
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
