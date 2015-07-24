'use strict';

angular.module('emmiManager')

/**
 *  This is the controller for the 'add locations' section on client edit (admin-facing/partials/location/client_new.html)
 */
    .controller('ClientAddNewLocationsController', ['$scope', 'Location', '$controller', 'Client', '$modal',
        function ($scope, Location, $controller, Client, $modal) {

        $controller('LocationCommon', {$scope: $scope});

        var addNewLocationsModal = $modal({
            scope: $scope,
            template: 'admin-facing/partials/client/location/search.html',
            animation: 'none',
            backdropAnimation: 'emmi-fade',
            show: false,
            backdrop: 'static'
        });

        $scope.addLocations = function () {
            $scope.searchPerformed = false;
            addNewLocationsModal.$promise.then(addNewLocationsModal.show);
        };

        $scope.hideAddLocationsModal = function () {
            addNewLocationsModal.hide();
        };

    }])

/**
 *  Controls the new location search/select popup (admin-facing/partials/location/search.html)
 */
    .controller('LocationListController', ['$scope', 'Location', '$http', 'Session', 'UriTemplate', '$controller', '$modal', 'focus', '$alert', 'Client', 'STATUS',
       function ($scope, Location, $http, Session, UriTemplate, $controller, $modal, focus, $alert, Client, STATUS) {

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

        $scope.setCheckboxesForChanged = function (clientLocationResources) {
            angular.forEach(clientLocationResources, function (clientLocationResource) {
                clientLocationResource.location.entity.newlocation = $scope.changedLocations[clientLocationResource.location.entity.id] ? true : false;
            });
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
            $scope.whenSaving = true;
            // need to return here to not break promise chain for saveAndAddAnother
            return Location.addLocationsToClient(Client.getClient(), newClientLocations).then(function () {
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
                    ' <strong>' + $scope.singleLocationAdded.name + '</strong> has been added successfully.' :
                        'The selected locations have been added successfully.';
                    $alert({
                        content: message
                    });
                }
            }).finally(function () {
                $scope.whenSaving = false;
            });
        };

        $scope.saveAndAddAnother = function () {
            $scope.save(true).then(function () {
                $scope.locationQuery = null;
                $scope.status = null;
                $scope.searchPerformed = false;
                $scope[managedLocationList] = null;
                focus('LocationSearchFocus');
                var clientName = (Client.getClient().entity.name) ? '<stong>' + Client.getClient().entity.name + '</strong>.' : 'the client.',
                    message = (!$scope.singleLocationAdded) ? 'The selected locations were successfully added to ' + clientName :
                    'The location <strong>' + $scope.singleLocationAdded.name + '</strong> has been successfully added to ' + clientName;
                $alert({
                    content: message,
                    container: '#modal-messages-container'
                });
            });
        };

        $scope.cancel = function () {
            // close the window without doing anything
            $scope.$hide();
        };

        $scope.search = function (formValid) {
            if (formValid) {
                $scope.changedLocations = {};
                $scope.loading = true;
                Location.find(Client.getClient(), $scope.locationQuery).then(function (locationPage) {
                    $scope.status = STATUS.ACTIVE_ONLY;
                    $scope.handleResponse(locationPage, managedLocationList);
                }, function () {
                    // error happened
                    $scope.loading = false;
                });
            }
        };

        $scope.statusChange = function () {
            $scope.loading = true;
            Location.find(Client.getClient(), $scope.locationQuery, $scope.status, $scope.sortProperty, $scope.currentPageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setCheckboxesForChanged($scope[managedLocationList]);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.fetchPage = function (href) {
            $scope.loading = true;
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setCheckboxesForChanged($scope[managedLocationList]);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.changePageSize = function (pageSize) {
            $scope.loading = true;
            Location.find(Client.getClient(), $scope.locationQuery, $scope.status, $scope.sortProperty, pageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setCheckboxesForChanged($scope[managedLocationList]);
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
                $scope.setCheckboxesForChanged($scope[managedLocationList]);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        var newLocationModal = $modal({
            scope: $scope,
            template: 'admin-facing/partials/client/location/new.html',
            animation: 'none',
            backdropAnimation: 'emmi-fade',
            show: false,
            backdrop: 'static'
        });

        $scope.createNewLocation = function () {
            $scope.hideAddLocationsModal();
            newLocationModal.$promise.then(newLocationModal.show);
        };

        $scope.hideNewLocationModal = function () {
            newLocationModal.hide();
        };

        function init() {
            $scope.locationQuery = null;
            $scope.status = 'ACTIVE_ONLY';
            $scope.searchPerformed = false;
            $scope[managedLocationList] = null;
            $scope.sortProperty = null;
        }

        init();

    }])
;
