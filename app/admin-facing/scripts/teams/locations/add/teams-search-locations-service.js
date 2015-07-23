'use strict';
angular.module('emmiManager')

    .service('TeamSearchLocation', ['$q', '$http','UriTemplate', 'CommonService', function ($q, $http, UriTemplate, CommonService) {
        var referenceData;

        return {
            save: function (url, locations) {
                return $http.post(UriTemplate.create(url).stringify(), locations).
                    then(function (response) {
                        var page = response.data;
                        /*var teamLocation;
                        angular.forEach(page.content, function(data) {
                            teamLocation = {'content':[data.teamLocation]};
                            CommonService.convertPageContentLinks(teamLocation);
                            data.teamLocation = teamLocation;
                        });*/

                        return page;
                    });
            },
            /**
             * create the TeamProviderTeamLocationSaveRequest to be saved
             *
             * @param teamClientLocations   locations selected on Client locations TAB
             * @param teamLocations         locations selected on Search All TAB
             * @param providersList         team location providers list to compare with selected in order to avoid to send save when select all is checked
             * @return TeamProviderTeamLocationSaveRequest
             *
             */
            getTeamProviderTeamLocationSaveRequest: function (selectedLocations, providersList) {
                var teamProviderTeamLocationSaveRequest = [];
                angular.forEach(selectedLocations, function(location){
                    var req = {};
                    req.location = location;
                    //Select ALL no rows on database
                    if (providersList.length === location.providersSelected.length) {
                        req.providers = [];
                    } else {
                        req.providers = location.providersSelected;
                    }
                    teamProviderTeamLocationSaveRequest.push(req);
                });
                return teamProviderTeamLocationSaveRequest;
            },

            setAllTabs: function(){
            	return {'activeTab' : 0, 'data' : [
            	        {
            	            'title': 'Client locations',
            	            'template': 'admin-facing/partials/team/location/tabs/team-client-locations-tab.html'
         		        },
         		        {
         		            'title': 'Search all locations',
         		            'template': 'admin-facing/partials/team/location/tabs/team-search-all-tab.html'
         		        }]};
            },
            
            /**
             * Associate all (client) locations to a team. 
             * 
             * @param teamResource the team to be associated to
             * @param selectedLocations contains locations having subset of providers
             * @param providersList the whole list of providers to compare with
             * @param selectAllBut contains a set of locations to be excluded
             */
            saveAllLocationsExcept: function(teamResource, selectedLocations, providersList, selectAllBut){
                var deferred = $q.defer();
                var self = this;
                // Only keep locations with subset of providers
                angular.forEach(selectedLocations, function(location){
                    if (providersList.length === location.providersSelected.length){
                        delete selectedLocations[location.id];
                    }
                });
                
                var locationsToAdd = self.getTeamProviderTeamLocationSaveRequest(selectedLocations, providersList);
                
                // First save locations with subset of providers
                self.save(teamResource.link.teamLocations, locationsToAdd).then(function(response){
                    var excludeSet = [];
                    // collect a set of location ids to be excluded
                    angular.forEach(selectAllBut, function(exclusion){
                        excludeSet.push(exclusion.id);
                    });
                    // associate all locations except the ones in excludeSet
                    $http.post(UriTemplate.create(teamResource.link.associateAllClientLocationsExcept).stringify(), excludeSet).then(function(response){
                        deferred.resolve(locationsToAdd);
                    });
                });
                return deferred.promise;
            }
        };
    }])

    .directive('clearSearch', [function () {
          return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {

               element.bind('keyup', function (event) {
                    if (!scope.locationQuery || scope.locationQuery.length === 0 )  {
                        scope.cleanSearch();
                    }
                });
            }
          };
    }])
;
