'use strict';
angular.module('emmiManager')
    .service('TeamLocation', function ($http, $q, $filter, Session, UriTemplate, arrays) {
        return {
            loadTeamLocations: function (scope, locationsToAdd) {
                var teamResource = scope.teamClientResource.teamResource;
                if (teamResource.entity.id) {
                    teamResource.locations = [];
                    var auxLocations = [];
                    return $http.get(UriTemplate.create(teamResource.link.teamLocations).stringify()).then(function load(response) {
                        var page = response.data;
                        var isNewAdd =false;
                        angular.forEach(page.content, function (teamLocation) {
                            //search if the location is in the locationsToAdd list
                            angular.forEach(locationsToAdd, function (location) {
                                if (location.id === teamLocation.entity.location.id) {
                                    isNewAdd = true;
                                }
                            });

                            //split the locations, recently added, and already added
                            if (isNewAdd) {
                                teamResource.locations.push(teamLocation);
                            }
                            else {
                                auxLocations.push(teamLocation);
                            }

                            teamLocation.entity.location.isNewAdd = false;
                            scope.teamLocations[teamLocation.entity.location.id] = angular.copy(teamLocation.entity.location);  
                        });

                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                load(response);
                            });
                        }

                        //order both arrays.
                        auxLocations = $filter('orderBy')(auxLocations, '+entity.location.name', false);
                        teamResource.locations = $filter('orderBy')(teamResource.locations, '+entity.location.name', false);
                        
                        //join sortered arrays
                        angular.forEach(auxLocations, function (teamLocation) {
                            teamResource.locations.push(teamLocation);
                        });

                        return teamResource.locations;
                    });
                }
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
