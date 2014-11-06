'use strict';
angular.module('emmiManager')
    .service('TeamLocation', function ($http, $q, $filter, Session, UriTemplate, arrays) {
        return {
            loadTeamLocations: function (scope, locationsToAdd, sort, pageSize) {
                var teamResource = scope.teamClientResource.teamResource;
                if (teamResource.entity.id) {
                    var locations = [], auxLocations = [];
                    return $http.get(UriTemplate.create(teamResource.link.teamLocations).stringify({
                            sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                            size: pageSize
                        })).then(function load(response) {
                        var page = response.data;
                        var isNewAdd =false;
                        angular.forEach(page.content, function (teamLocation) {
                            //search if the location is in the locationsToAdd list
                            angular.forEach(locationsToAdd, function (location) {
                                if (location.id === teamLocation.entity.location.id) {
                                    isNewAdd = true;
                                } else {
                                    isNewAdd = false;
                                }

                            });

                            //split the locations, recently added, and already added
                            if (isNewAdd) {
                                locations.push(teamLocation);
                            }
                            else {
                                auxLocations.push(teamLocation);
                            }

                            teamLocation.entity.location.isNewAdd = false;
                            scope.teamLocations[teamLocation.entity.location.id] = angular.copy(teamLocation.entity.location);  
                        });

                        //order both arrays.
                        auxLocations = $filter('orderBy')(auxLocations, '+entity.location.name', false);
                        locations = $filter('orderBy')(locations, '+entity.location.name', false);
                        
                        //join sortered arrays
                        angular.forEach(auxLocations, function (teamLocation) {
                            locations.push(teamLocation);
                        });

                        page.content = locations;

                        return page;
                    });
                }
            },
            loadTeamLocationsSimple: function (scope, locationsToAdd, sort, pageSize) {
                return $http.get(UriTemplate.create(scope.teamClientResource.teamResource.link.teamLocations).stringify({
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        size: pageSize
                    })).then(function load(response) {
                    angular.forEach(response.data.content, function (teamLocation) {
                        scope.teamLocations[teamLocation.entity.location.id] = angular.copy(teamLocation.entity.location);  
                    });
                    return response.data;
                });
            },
            removeLocation: function (locationResource) {
                locationResource.links = arrays.convertToObject('rel', 'href', locationResource.link);
                return $http.delete(UriTemplate.create(locationResource.links.self).stringify())
                    .then(function (response) {
                        return response.data;
                    });
            },            

        };
    })
;
