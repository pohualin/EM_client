'use strict';

angular.module('emmiManager')

/**
 *  Common controller which handles reference data loading and location page response parsing
 */
    .controller('LocationCommon', function ($scope, Location, Client) {

        Location.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
            $scope.states = refData.state;
        });

        $scope.noSearch = true;

        $scope.client = Client.getClient();

        $scope.isEmpty = function (obj) {
            return angular.equals({}, obj);
        };

        /**
         * For each location in the managedLocationList check to see if the entity
         * is in the list of locations that will be removed on save. If so, set the
         * 'removedFromClient' attribute on the location.
         *
         * @param managedLocationList a string, the name of the location list in $scope
         */
        $scope.setRemovedOnLocationsWithin = function (managedLocationList) {
            // look through the clientLocations and 'remove' it if has already been targeted
            angular.forEach($scope[managedLocationList], function (locationResource) {
                if (Client.getClient().removedLocations) {
                    if (Client.getClient().removedLocations[locationResource.entity.id]) {
                        locationResource.entity.removedFromClient = true;
                    } else {
                        delete locationResource.entity.removedFromClient;
                    }
                }
            });
        };

        $scope.removeExistingLocation = function (locationResource) {
            Client.getClient().removedLocations[locationResource.entity.id] = locationResource.entity;
            locationResource.entity.removedFromClient = true;
        };

        $scope.removeLocationFromRemovedList = function (locationResource) {
            delete Client.getClient().removedLocations[locationResource.entity.id];
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

        $scope.getLocationFromBelongsToChangedList = function (locationResource){
           return (locationResource && locationResource.entity) ? Client.getClient().belongsToChanged[locationResource.entity.id] : null;
        };

        $scope.addLocationToBelongsToChangedList = function (locationResource) {
            Client.getClient().belongsToChanged[locationResource.entity.id] = locationResource.entity;
        };
    })

/**
 *  Controls the edit location popup (partials/location/edit.html)
 */
    .controller('LocationEditController', function ($scope, $controller, Location) {

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

                    // add location to change list if the checkbox state in the edit window is
                    // different than what is stored on the db
                    if (toBeSaved.belongsToCheckbox !== locationResource.entity.belongsToCheckbox) {
                        $scope.addLocationToBelongsToChangedList(locationResource);
                        locationResource.entity.belongsToCheckbox = toBeSaved.belongsToCheckbox;
                    }

                    var onChangeList = $scope.getLocationFromBelongsToChangedList(locationResource);
                    // update the copy in the change list
                    if (onChangeList){
                        angular.extend(onChangeList, locationResource.entity);
                    }

                    // overwrite original location with saved one
                    angular.copy(locationResource.entity, $scope.originalLocation);
                    $scope.$hide();
                });
            }
        };

    })

/**
 *  Controls the create new location popup (partials/location/new.html)
 */
    .controller('LocationCreateController', function ($scope, $controller, Location, $timeout) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.location = Location.newLocation();

        $scope.title = 'New Location';

        $scope.saveAndAddAnother = function(isValid){
            $scope.saveLocation(isValid, true);
        };

        $scope.saveLocation = function (isValid, addAnother) {
            $scope.locationFormSubmitted = true;
            if (isValid) {
                var toBeSaved = $scope.location;
                Location.create(toBeSaved).then(function (location) {
                    var locationResource = location.data;
                    $scope.addLocationToAddedList(locationResource);
                    locationResource.entity.belongsToMutable = true;
                    locationResource.entity.belongsToCheckbox = toBeSaved.belongsToCheckbox;
                    if (toBeSaved.belongsToCheckbox) {
                        $scope.addLocationToBelongsToChangedList(locationResource);
                    }
                    $scope.hideNewLocationModal();
                    if (addAnother) {
                        $scope.addLocations();
                    }
                });
            }
        };

    })

/**
 *  Controls the new location search/select popup (partials/location/search.html)
 */
    .controller('LocationListController', function ($scope, Location, $http, Session, UriTemplate, $controller, $modal) {

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
            $scope.setExistsOnLocationsWithin(managedLocationList);
            $scope.setRemovedOnLocationsWithin(managedLocationList);
            $scope.setAddedOnLocationsWithin(managedLocationList);
            angular.forEach($scope[managedLocationList], function (locationResource) {
                var alreadyExists = locationResource.entity.existsOnClient;
                var alreadyRemoved = locationResource.entity.removedFromClient;
                var alreadyNew = locationResource.entity.addToClient;

                // set the current (saved) state
                locationResource.entity.currentNewLocationState = !alreadyRemoved && (alreadyExists || alreadyNew);

                var alreadyChangedLocation = $scope.changedLocations[locationResource.entity.id];
                if (!alreadyChangedLocation) {
                    // it hasn't been changed yet, set newlocation to the current state
                    locationResource.entity.newlocation = locationResource.entity.currentNewLocationState;
                } else {
                    // it has been changed set newlocation to the changed state
                    locationResource.entity.newlocation = alreadyChangedLocation.entity.newlocation;
                }
            });
        };

        $scope.changedLocations = {};

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

        $scope.save = function () {
            // for every changed location, put the change into the correct bucket
            angular.forEach($scope.changedLocations, function (locationResource) {
                var location = locationResource.entity,
                    previouslyRemoved = location.removedFromClient,
                    alreadyExists = locationResource.entity.existsOnClient,
                    previouslyAdded = location.addToClient;

                if (location.newlocation) {
                    // location was checked
                    if (previouslyRemoved) {
                        // and it was removed previously, remove it from the removed list
                        $scope.removeLocationFromRemovedList(locationResource);
                        $scope.setRemovedOnLocationsWithin('clientLocations');
                    } else {
                        if (!alreadyExists && !previouslyAdded) {
                            // add it to the list, if it isn't already there
                            $scope.addLocationToAddedList(locationResource);
                        }
                    }
                } else {
                    // location was unchecked
                    if (previouslyAdded || alreadyExists) {
                        // and it was added previously, remove it from the added list
                        $scope.removeLocationFromAddedList(locationResource);
                        $scope.removeExistingLocation(locationResource);
                        $scope.setRemovedOnLocationsWithin('clientLocations');
                    }
                }
            });
            $scope.$hide();
        };

        $scope.cancel = function () {
            // close the window without doing anything
            $scope.$hide();
        };

        $scope.search = function () {
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

        $scope.statusChange = function(){
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
            setProperty: function (property){
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
            reset: function(){
                this.property = null;
                this.ascending = null;
                this.resetOnNextSet = false;
            }
        };

        // when a column header is clicked
        $scope.sort = function(property){
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

        var newLocationModal = $modal({scope: $scope, template: 'partials/client/location/new.html', animation: 'am-fade-and-scale', show: false});

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

        var editLocationModal = $modal({scope: $scope, template: 'partials/client/location/edit.html', animation: 'am-fade-and-scale', show: false});
        var managedLocationList = 'clientLocations';

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

        Location.findForClient(Client.getClient()).then(function (locationPage) {
            $scope.handleResponse(locationPage, managedLocationList);
            $scope.setRemovedOnLocationsWithin(managedLocationList);
        });

        $scope.fetchPage = function (href) {
            $scope.clientLocations = null;
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setRemovedOnLocationsWithin(managedLocationList);
            });
        };

        $scope.changePageSize = function (pageSize) {
            $scope.clientLocations = null;
            Location.findForClient(Client.getClient(), pageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage, managedLocationList);
                $scope.setRemovedOnLocationsWithin(managedLocationList);
            });
        };
    })

/**
 *  This is the controller for the 'add locations' section on client edit (partials/location/client_new.html)
 */
    .controller('ClientAddNewLocationsController', function ($scope, Location, $controller, Client, $modal) {

        $controller('LocationCommon', {$scope: $scope});

        var addNewLocationsModal = $modal({scope: $scope, template: 'partials/client/location/search.html', animation: 'am-fade-and-scale', show: false});

        $scope.addLocations = function () {
            addNewLocationsModal.$promise.then(addNewLocationsModal.show);
        };

        $scope.hideAddLocationsModal = function () {
            addNewLocationsModal.hide();
        };

        if (Client.getClient()) {
            if (!Client.getClient().addedLocations) {
                Client.getClient().addedLocations = {};
            }
        }

        $scope.removeNewLocation = function (location) {
            // wrap as a resource to remove
            $scope.removeLocationFromAddedList({
                entity: location
            });
        };

        Location.findAllIdsForClient(Client.getClient()).then(function (idSet) {
            $scope.selectedIdsForClient = idSet;
            // ensure that the 'add locations' text doesn't appear until we've fetched all of the ids
            $scope.idsFetched = true;
            $scope.isExistingLocation = function (locationResource) {
                return $scope.selectedIdsForClient.indexOf(locationResource.entity.id) !== -1;
            };
        });

    })

    .controller('ClientRemoveExistingLocationsController', function ($scope, $controller, Client) {
        $controller('LocationCommon', {$scope: $scope});

        if (Client.getClient()) {
            if (!Client.getClient().removedLocations) {
                Client.getClient().removedLocations = {};
            }
        }
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