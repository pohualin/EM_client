'use strict';

angular.module('emmiManager')

/**
 *  Common controller which handles reference data loading and location page response parsing
 */
    .controller('LocationCommon', function ($scope, Location, Client, $alert) {

        Location.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
            $scope.states = refData.state;
        });

        $scope.noSearch = true;

        $scope.client = Client.getClient();

        if ($scope.client && !$scope.client.addedLocations) {
            $scope.client.addedLocations = {};
            $scope.client.hasLocations = function(){
                return !angular.equals({}, this.addedLocations) || $scope.clientLocations;
            };
        }

        $scope.isEmpty = function (obj) {
            return angular.equals({}, obj);
        };

        $scope.showRemovalSuccess = function (locationResource){
            var clientName = Client.getClient().entity.name ? Client.getClient().entity.name : 'this client';
            $alert({
                title: ' ',
                content: 'The location <b>' + locationResource.entity.name + '</b> has been successfully removed from <b>' + clientName + '</b>',
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
                Location.findForClient(Client.getClient()).then(function (allLocations) {
                    $scope.clientLocations = allLocations;
                });
            });
        };

        $scope.setExistsOnLocationsWithin = function (managedLocationList) {
            angular.forEach($scope[managedLocationList], function (locationResource) {
                if ($scope.isExistingLocation(locationResource)) {
                    locationResource.entity.existsOnClient = true;
                } else {
                    delete locationResource.entity.existsOnClient;
                }
            });
        };

        $scope.setAddedOnLocationsWithin = function (managedLocationList) {
            angular.forEach($scope[managedLocationList], function (locationResource) {
                if (Client.getClient().addedLocations[locationResource.entity.id]) {
                    locationResource.entity.addToClient = true;
                } else {
                    delete locationResource.entity.addToClient;
                }
            });
        };

        $scope.addLocationToAddedList = function (locationResource) {
            Client.getClient().addedLocations[locationResource.entity.id] = locationResource.entity;
            locationResource.entity.addToClient = true;
        };

        $scope.removeLocationFromAddedList = function (locationResource) {
            delete Client.getClient().addedLocations[locationResource.entity.id];
            $scope.showRemovalSuccess(locationResource);
        };

        $scope.setBelongsToPropertiesFor = function (location) {
            if (!location.belongsTo) {
                location.belongsToMutable = true;
            } else {
                if (location.belongsTo.id === Client.getClient().entity.id) {
                    location.belongsToMutable = true;
                    location.belongsToCheckbox = true;
                }
            }
        };

        $scope.getLocationFromBelongsToChangedList = function (locationResource) {
            return (locationResource && locationResource.entity) ? Client.getClient().belongsToChanged[locationResource.entity.id] : null;
        };

        $scope.addLocationToBelongsToChangedList = function (locationResource) {
            Client.getClient().belongsToChanged[locationResource.entity.id] = locationResource.entity;
        };

        $scope.showErrorBanner = function () {
            $alert({
                title: ' ',
                content: 'Please correct the below information.',
                container: '#message-container',
                type: 'danger',
                show: true,
                dismissable: false
            });
        };

        $scope.loadAllIds = function () {
            $scope.idsFetched = false;
            return Location.findAllIdsForClient(Client.getClient()).then(function (idSet) {
                $scope.selectedIdsForClient = idSet;
                // ensure that the 'add locations' text doesn't appear until we've fetched all of the ids
                $scope.idsFetched = true;
                $scope.isExistingLocation = function (locationResource) {
                    return $scope.selectedIdsForClient.indexOf(locationResource.entity.id) !== -1;
                };
            });
        };


    })

/**
 *  Controls the edit location popup (partials/location/edit.html)
 */
    .controller('LocationEditController', function ($scope, $controller, Location, Client) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.title = 'Edit Location';

        $scope.saveLocation = function (isValid) {
            $scope.locationFormSubmitted = true;
            if (isValid) {
                var toBeSaved = $scope.location;
                Location.update(toBeSaved).then(function (response) {
                    var locationResource = response.data;

                    // set the properties for managing to belongsTo relations
                    $scope.setBelongsToPropertiesFor(locationResource.entity);

                    // set the belongsTo entity for this location
                    if (toBeSaved.belongsToCheckbox){
                        locationResource.entity.belongsTo = Client.getClient().entity;
                    } else {
                        delete locationResource.entity.belongsTo;
                    }

                    // add location to change list if the checkbox state in the edit window is
                    // different than what is stored on the db
                    if (toBeSaved.belongsToCheckbox !== locationResource.entity.belongsToCheckbox) {
                        $scope.addLocationToBelongsToChangedList(locationResource);
                        locationResource.entity.belongsToCheckbox = toBeSaved.belongsToCheckbox;
                    }

                    var onChangeList = $scope.getLocationFromBelongsToChangedList(locationResource);
                    // update the copy in the change list
                    if (onChangeList) {
                        angular.extend(onChangeList, locationResource.entity);
                    }

                    // overwrite original location with saved one
                    angular.copy(locationResource.entity, $scope.originalLocation);
                    $scope.$hide();
                });
            } else {
                $scope.showErrorBanner();
            }
        };

    })

/**
 *  Controls the create new location popup (partials/location/new.html)
 */
    .controller('LocationCreateController', function ($scope, $controller, Location, $alert, Client) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.location = Location.newLocation();

        $scope.title = 'New Location';

        $scope.saveAndAddAnother = function (isValid) {
            $scope.saveLocation(isValid, true);
        };

        $scope.saveLocation = function (isValid, addAnother) {
            $scope.locationFormSubmitted = true;
            if (isValid) {
                var toBeSaved = $scope.location;
                Location.create(toBeSaved).then(function (location) {
                    var locationResource = location.data;
                    locationResource.entity.belongsToMutable = true;
                    locationResource.entity.belongsToCheckbox = toBeSaved.belongsToCheckbox;
                    if (toBeSaved.belongsToCheckbox) {
                        locationResource.entity.belongsTo = Client.getClient().entity;
                        $scope.addLocationToBelongsToChangedList(locationResource);
                    }
                    $scope.addLocationToAddedList(locationResource);
                    $scope.hideNewLocationModal();
                    if (addAnother) {
                        $scope.addLocations();
                        $alert({
                            title: ' ',
                            content: 'The location <b>' + locationResource.entity.name + '</b> has been successfully created.',
                            container: '#message-container',
                            type: 'success',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });
                    }
                });
            } else {
                $scope.showErrorBanner();
            }
        };

    })

/**
 *  Controls the new location search/select popup (partials/location/search.html)
 */
    .controller('LocationListController', function ($scope, Location, $http, Session, UriTemplate, $controller, $modal, focus, $alert, Client) {

        $controller('LocationCommon', {$scope: $scope});

        var managedLocationList = 'locations';

        /**
         * Sets the attribute 'newLocation' based upon the state of the locations
         * within the managed list as well as whether or not this location has already
         * been changed by the user.
         *
         * @param managedLocationList a String, the name of the list in $scope
         */
        $scope.setNewLocationAttribute = function (managedLocationList) {
            $scope.loadAllIds().then(function () {
                $scope.setExistsOnLocationsWithin(managedLocationList);
                $scope.setAddedOnLocationsWithin(managedLocationList);
                angular.forEach($scope[managedLocationList], function (locationResource) {
                    var alreadyExists = locationResource.entity.existsOnClient;
                    var alreadyNew = locationResource.entity.addToClient;

                    // set the current (saved) state
                    locationResource.entity.currentNewLocationState = alreadyExists || alreadyNew;

                    var alreadyChangedLocation = $scope.changedLocations[locationResource.entity.id];
                    if (!alreadyChangedLocation) {
                        // it hasn't been changed yet, set newlocation to the current state
                        locationResource.entity.newlocation = locationResource.entity.currentNewLocationState;
                    } else {
                        // it has been changed set newlocation to the changed state
                        locationResource.entity.newlocation = alreadyChangedLocation.entity.newlocation;
                    }
                });
            });

        };

        /**
         * Called when the checkbox on the select popup is checked or unchecked
         * @param locationResource it was checked on
         */
        $scope.onCheckboxChange = function (locationResource) {
            if (locationResource.entity.currentNewLocationState === locationResource.entity.newlocation) {
                // the checkbox is the same as it was at the start, location not changed
                delete $scope.changedLocations[locationResource.entity.id];
            } else {
                // this is a change from the saved state, store a copy of the object
                $scope.changedLocations[locationResource.entity.id] = angular.copy(locationResource);
            }
        };

        $scope.save = function (addAnother) {
            // for every changed location, put the change into the correct bucket
            angular.forEach($scope.changedLocations, function (locationResource) {
                var location = locationResource.entity,
                    alreadyExists = locationResource.entity.existsOnClient,
                    previouslyAdded = location.addToClient;

                if (location.newlocation) {
                    // location was checked
                    if (!alreadyExists && !previouslyAdded) {
                        // add it to the list, if it isn't already there
                        $scope.addLocationToAddedList(locationResource);
                    }
                }
            });
            if (!addAnother) {
                $scope.$hide();
            }
        };

        $scope.saveAndAddAnother = function () {
            $scope.save(true);
            $scope.locationQuery = null;
            $scope.status = null;
            $scope.noSearch = true;
            $scope[managedLocationList] = null;
            focus('LocationSearchFocus');
            var clientName = (Client.getClient().entity.name) ? '<b>' + Client.getClient().entity.name + '</b>.' : 'the client.';
            $alert({
                title: ' ',
                content: 'The selected locations were successfully added to ' + clientName,
                container: '#message-container',
                type: 'success',
                show: true,
                duration: 5,
                dismissable: true
            });
        };

        $scope.cancel = function () {
            // close the window without doing anything
            $scope.$hide();
        };

        $scope.handleResponse = function (locationPage, locationsPropertyName) {
            if (locationPage) {
                this[locationsPropertyName] = locationPage.content;

                $scope.total = locationPage.page.totalElements;
                $scope.links = [];
                for (var i = 0, l = locationPage.linkList.length; i < l; i++) {
                    var aLink = locationPage.linkList[i];
                    if (aLink.rel.indexOf('self') === -1) {
                        $scope.links.push({
                            order: i,
                            name: aLink.rel.substring(5),
                            href: aLink.href
                        });
                    }
                }
                $scope.load = locationPage.link.self;
                $scope.currentPage = locationPage.page.number;
                $scope.currentPageSize = locationPage.page.size;
                $scope.pageSizes = [5, 10, 15, 25];
                $scope.status = locationPage.filter.status;
            } else {
                $scope.total = 0;
                $scope[locationsPropertyName] = null;
            }
            $scope.noSearch = false;
            $scope.loading = false;
        };

        $scope.search = function () {
            $scope.changedLocations = {};
            $scope.loading = true;
            Location.find($scope.locationQuery, $scope.status).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setNewLocationAttribute(managedLocationList);
                $scope.removeStatusFilterAndTotal = $scope.total <= 0;
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.statusChange = function () {
            $scope.loading = true;
            Location.find($scope.locationQuery, $scope.status, $scope.sortProperty, $scope.currentPageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setNewLocationAttribute(managedLocationList);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.fetchPage = function (href) {
            $scope.loading = true;
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setNewLocationAttribute(managedLocationList);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.changePageSize = function (pageSize) {
            $scope.loading = true;
            Location.find($scope.locationQuery, $scope.status, $scope.sortProperty, pageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setNewLocationAttribute(managedLocationList);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.sortProperty = {
            property: null,
            ascending: null,
            resetOnNextSet: false,
            setProperty: function (property) {
                if (this.property === property) {
                    if (!this.resetOnNextSet) {
                        if (this.ascending !== null) {
                            // this property has already been sorted on once
                            // the next click after this one should turn off the sort
                            this.resetOnNextSet = true;
                        }
                        this.ascending = !this.ascending;
                    } else {
                        this.reset();
                    }
                } else {
                    this.property = property;
                    this.ascending = true;
                    this.resetOnNextSet = false;
                }
            },
            reset: function () {
                this.property = null;
                this.ascending = null;
                this.resetOnNextSet = false;
            }
        };

        // when a column header is clicked
        $scope.sort = function (property) {
            $scope.sortProperty.setProperty(property);
            $scope.loading = true;
            Location.find($scope.locationQuery, $scope.status, $scope.sortProperty, $scope.currentPageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setNewLocationAttribute(managedLocationList);
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        var newLocationModal = $modal({scope: $scope, template: 'partials/client/location/new.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

        $scope.createNewLocation = function () {
            $scope.hideAddLocationsModal();
            newLocationModal.$promise.then(newLocationModal.show);
        };

        $scope.hideNewLocationModal = function () {
            newLocationModal.$promise.then(newLocationModal.destroy);
        };
    })

/**
 *   Controls the existing locations section (partials/location/client_current.html)
 */
    .controller('ClientLocationsController', function ($scope, Location, $http, Session, UriTemplate, $controller, $modal, Client) {

        $controller('LocationCommon', {$scope: $scope});

        var editLocationModal = $modal({scope: $scope, template: 'partials/client/location/edit.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

        $scope.editLocation = function (location) {
            // create a copy for editing
            $scope.location = angular.copy(location);

            if (!Client.getClient().belongsToChanged[location.id]) {
                // not on the change list, set the properties
                $scope.setBelongsToPropertiesFor($scope.location);
            }

            // save the original for overlay if save is clicked
            $scope.originalLocation = location;

            // show the dialog box
            editLocationModal.$promise.then(editLocationModal.show);
        };

        Location.findForClient(Client.getClient()).then(function (allLocations) {
            $scope.clientLocations = allLocations;
        });
    })

/**
 *  This is the controller for the 'add locations' section on client edit (partials/location/client_new.html)
 */
    .controller('ClientAddNewLocationsController', function ($scope, Location, $controller, Client, $modal) {

        $controller('LocationCommon', {$scope: $scope});

        var addNewLocationsModal = $modal({scope: $scope, template: 'partials/client/location/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

        $scope.addLocations = function () {
            addNewLocationsModal.$promise.then(addNewLocationsModal.show);
        };

        $scope.hideAddLocationsModal = function () {
            addNewLocationsModal.hide();
        };

        $scope.removeNewLocation = function (location) {
            // wrap as a resource to remove
            $scope.removeLocationFromAddedList({
                entity: location
            });
        };

    })

    .controller('ClientBelongsToDeltaLocationsController', function ($scope, $controller, Client) {
        $controller('LocationCommon', {$scope: $scope});

        if (Client.getClient()) {
            if (!Client.getClient().belongsToChanged) {
                Client.getClient().belongsToChanged = {};
            }
        }
    })


;