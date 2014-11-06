'use strict';

angular.module('emmiManager')

/**
 *  This is the controller for the 'add locations' section on client edit (partials/location/client_new.html)
 */
    .controller('ClientAddNewLocationsController', function ($scope, Location, $controller, Client, $modal) {

        $controller('LocationCommon', {$scope: $scope});

        var addNewLocationsModal = $modal({scope: $scope, template: 'partials/client/location/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, backdrop: 'static'});

        $scope.addLocations = function () {
            $scope.searchPerformed = false;
            addNewLocationsModal.$promise.then(addNewLocationsModal.show);
        };

        $scope.hideAddLocationsModal = function () {
            addNewLocationsModal.hide();
        };

    })

/**
 *  Controls the new location search/select popup (partials/location/search.html)
 */
    .controller('LocationListController', function ($scope, Location, $http, Session, UriTemplate, $controller, $modal, focus, $alert, Client) {

        $controller('LocationCommon', {$scope: $scope});

        $controller('CommonPagination', {$scope: $scope});

        $scope.pageSizes = [5, 10, 15, 25];

        var managedLocationList = 'locations';

        /**
         * Called when the checkbox on the select popup is checked or unchecked
         * @param locationResource it was checked on
         */
        $scope.onCheckboxChange = function (locationResource) {
            if (locationResource.entity.newlocation) {
                // checked
                $scope.changedLocations[locationResource.entity.id] = angular.copy(locationResource);
            } else {
                // unchecked
                delete $scope.changedLocations[locationResource.entity.id];
            }
        };

        /**
         * Adds locations to the client
         * @param addAnother whether or not we're going to add more after this save
         */
        $scope.save = function (addAnother) {
            var newClientLocations = [];

            angular.forEach($scope.changedLocations, function (locationResource) {
                newClientLocations.push(locationResource.entity);
            });
            
            // Reset changedLocations to empty
            $scope.changedLocations = {};
            // save the new locations
            return Location.addLocationsToClient(Client.getClient(), newClientLocations).then(function(){
                // reload the existing locations
                $scope.performSearch();

                if (newClientLocations.length === 1) {
                    $scope.singleLocationAdded = newClientLocations[0];
                } else {
                    delete $scope.singleLocationAdded;
                }

                // close the modal and show the message
                if (!addAnother) {
                    $scope.$hide();
                    var message = ($scope.singleLocationAdded) ?
                        ' <b>' + $scope.singleLocationAdded.name + '</b> has been added successfully.' :
                        'The selected locations have been added successfully.';
                    $alert({
                        title: ' ',
                        content: message,
                        container: '#remove-container',
                        type: 'success',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                }
            });
        };

        $scope.saveAndAddAnother = function () {
            $scope.save(true).then(function (){
                $scope.locationQuery = null;
                $scope.status = null;
                $scope.searchPerformed = false;
                $scope[managedLocationList] = null;
                focus('LocationSearchFocus');
                var clientName = (Client.getClient().entity.name) ? '<b>' + Client.getClient().entity.name + '</b>.' : 'the client.',
                    message = (!$scope.singleLocationAdded) ? 'The selected locations were successfully added to ' + clientName :
                        'The location <b>' + $scope.singleLocationAdded.name + '</b> has been successfully added to ' + clientName;
                $alert({
                    title: ' ',
                    content: message,
                    container: '#message-container',
                    type: 'success',
                    show: true,
                    duration: 5,
                    dismissable: true
                });
            });
        };

        $scope.cancel = function () {
            // close the window without doing anything
            $scope.$hide();
        };

        $scope.search = function () {
            $scope.changedLocations = {};
            $scope.loading = true;
            Location.find(Client.getClient(), $scope.locationQuery).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.removeStatusFilterAndTotal = $scope.total <= 0;
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.statusChange = function () {
            $scope.loading = true;
            Location.find(Client.getClient(), $scope.locationQuery, $scope.status, $scope.sortProperty, $scope.currentPageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.fetchPage = function (href) {
            $scope.loading = true;
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.changePageSize = function (pageSize) {
            $scope.loading = true;
            Location.find(Client.getClient(), $scope.locationQuery, $scope.status, $scope.sortProperty, pageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        // when a column header is clicked
        $scope.sort = function (property) {
            var sort = $scope.sortProperty || {};
            if (sort && sort.property === property) {
                // same property was clicked
                if (!sort.ascending) {
                    // third click removes sort
                    sort = null;
                } else {
                    // switch to descending
                    sort.ascending = false;
                }
            } else {
                // change sort property
                sort.property = property;
                sort.ascending = true;
            }
            $scope.loading = true;
            Location.find(Client.getClient(), $scope.locationQuery, $scope.status, sort, $scope.currentPageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        var newLocationModal = $modal({scope: $scope, template: 'partials/client/location/new.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false, backdrop: 'static'});

        $scope.createNewLocation = function () {
            $scope.hideAddLocationsModal();
            newLocationModal.$promise.then(newLocationModal.show);
        };

        $scope.hideNewLocationModal = function () {
            newLocationModal.$promise.then(newLocationModal.destroy);
        };
        
        $scope.isChangedLocationsEmpty = function(){
        	return Object.keys($scope.changedLocations).length === 0 ? true : false;
        };
    })
;