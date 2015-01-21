'use strict';
angular.module('emmiManager')

    .service('TeamSearchLocation', ['$http','UriTemplate', 'CommonService', function ($http, UriTemplate, CommonService) {
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
            getTeamProviderTeamLocationSaveRequest: function (teamClientLocations, teamLocations, providersList) {
                var teamProviderTeamLocationSaveRequest = [];

                angular.forEach( teamClientLocations , function (location) {
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
                angular.forEach( teamLocations , function (location) {
                    var req = {};
                    if (location.isNewAdd) {
                        location.isNewAdd = false;
                        req.location = location;
                        if (providersList.length === location.providersSelected.length) { 
                            req.providers = [];
                        } else {
                            req.providers = location.providersSelected;
                        }
                        teamProviderTeamLocationSaveRequest.push(req);
                    }
                });

                return teamProviderTeamLocationSaveRequest;
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
