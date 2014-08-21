'use strict';

angular.module('emmiManager')

    .controller('LocationCommon', function ($scope, Location) {

        Location.getReferenceData().then(function (refData) {
            $scope.statuses = refData.statusFilter;
            $scope.states = refData.state;
        });

        $scope.noSearch = true;

        if ($scope.client) {
            if (!$scope.client.addedLocations) {
                $scope.client.addedLocations = {};
            }
        }

        $scope.isEmpty = function (obj) {
            return angular.equals({},obj);
        };

        $scope.addNewLocation = function(location){
            location.newlocation = true;
            $scope.client.addedLocations[location.id] = location;
        };

        $scope.removeNewLocation = function(location){
            delete $scope.client.addedLocations[location.id];
        };

        $scope.updateNewLocation = function(location){
            if (location.newlocation){
                $scope.addNewLocation(location);
            } else {
                $scope.removeNewLocation(location);
            }
        };

        $scope.handleResponse = function (locationPage) {
            if (locationPage) {
                $scope.locations = locationPage.content;

                angular.forEach($scope.locations, function(location) {
                    if ($scope.client.addedLocations[location.entity.id]){
                        $scope.addNewLocation(location.entity);
                    }
                });

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
                $scope.pageSizes = [10, 25, 50, 100];
                $scope.status = locationPage.filter.status;
            } else {
                $scope.total = 0;
            }
            $scope.noSearch = false;
        };
    })

    .controller('LocationEditController', function ($scope, $controller, Location) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.title = 'Edit Location';

        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid) {
                Location.update($scope.location).then(function (location) {
                    $scope.$hide();
                });
            }
        };

    })

    .controller('LocationCreateController', function ($scope, $controller, Location) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.location = {
            'name': null,
            'phone': null,
            'city': null,
            'state': null,
            'usingThisLocation': []
        };

        $scope.title = 'New Location';

        $scope.save = function (isValid) {
            $scope.formSubmitted = true;
            if (isValid) {
                Location.create($scope.location).then(function (location) {
                    $scope.addNewLocation(location.data.entity);
                    $scope.$hide();
                });
            }
        };

    })

    .controller('LocationListController', function ($scope, Location, $http, Session, UriTemplate, $controller, $modal) {

        $controller('LocationCommon', {$scope: $scope});

        $scope.search = function () {
            $scope.locations = null;
            Location.find($scope.locationQuery, $scope.status).then(function (locationPage) {
                $scope.handleResponse(locationPage);
            });
        };

        $scope.fetchPage = function (href) {
            $scope.locations = null;
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage);
            });
        };

        $scope.changePageSize = function (pageSize) {
            $scope.locations = null;
            Location.find($scope.locationQuery, $scope.status, pageSize).then(function (locationPage) {
                $scope.handleResponse(locationPage);
            });
        };

        var newLocationModal = $modal({scope: $scope, template: 'partials/location/new.html', animation: 'am-fade-and-scale', show: false});

        $scope.createNewLocation = function(){
            $scope.$hide();
            newLocationModal.$promise.then(newLocationModal.show);
        };
    })

    .controller('ClientLocationsController', function ($scope, Location, $http, Session, UriTemplate, $controller, $modal, Client) {

        $controller('LocationCommon', {$scope: $scope});

        var addNewLocationsModal = $modal({scope: $scope, template: 'partials/location/search.html', animation: 'am-fade-and-scale', show: false});
        var editLocationModal = $modal({scope: $scope, template: 'partials/location/edit.html', animation: 'am-fade-and-scale', show: false});

        $scope.editLocation = function(location){
            // pop edit location modal
            $scope.location = location;
            editLocationModal.$promise.then(editLocationModal.show);
        };

        $scope.addLocations = function(){
            addNewLocationsModal.$promise.then(addNewLocationsModal.show);
        };

        Location.findForClient(Client.getClient()).then(function (locationPage) {
            $scope.handleResponse(locationPage);
        });

        $scope.fetchPage = function (href) {
            $scope.locations = null;
            Location.fetchPageLink(href).then(function (locationPage) {
                $scope.handleResponse(locationPage);
            });
        };

        $scope.changePageSize = function (pageSize) {
            $scope.locations = null;
            Location.findForClient(Client.getClient(), pageSize).then(function (locationPage) {
                $scope.client.locations = locationPage.content;
                $scope.handleResponse(locationPage);
            });
        };
    })

;