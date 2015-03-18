'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterCommon', function ($scope, $location, URL_PARAMETERS, arrays, $rootScope, TeamsFilter, $q) {
        var searchObject = $location.search();
        $scope.getGroupUrlParameter = function () {
            if (searchObject[URL_PARAMETERS.SELECTED_GROUP] && searchObject[URL_PARAMETERS.SELECTED_GROUP] !== '') {
                var deferred = $q.defer();
                TeamsFilter.getClientGroups().then(function (groups) {
                    angular.forEach(groups, function (clientGroup) {
                        //find the group entity for the group id in the URL
                        if (searchObject && clientGroup.entity.id === parseInt(searchObject[URL_PARAMETERS.SELECTED_GROUP])) {
                            $scope.selectedGroup = clientGroup;
                        }
                    });
                    deferred.resolve($scope.selectedGroup);
                });

                return deferred.promise;
            }
        };

        $scope.getTagsUrlParameter = function () {
            if (searchObject && searchObject[URL_PARAMETERS.SELECTED_TAGS] && searchObject[URL_PARAMETERS.SELECTED_TAGS] !== '') {
                var deferred = $q.defer();
                var selectedTags = (searchObject[URL_PARAMETERS.SELECTED_TAGS]).split(',');
                TeamsFilter.getActiveOrAllTeamTagsForFilteredTags({}, $scope.showInactiveTeams).then(function (teamTags) {
                    angular.forEach(selectedTags, function (tagToLoadFromURLid) {
                        //for each tag id in the url...

                        var keepGoing = true;
                        angular.forEach(teamTags, function (teamTag) {
                            //check each team tag...
                            if (keepGoing && teamTag.tag.id === parseInt(tagToLoadFromURLid)) {
                                $scope.filterTags.push(teamTag.tag);
                                keepGoing = false;
                            }
                        });
                        deferred.resolve($scope.filterTags);
                    });
                });

                return deferred.promise;
            }
        };

        $scope.getInactiveAndUntaggedUrlParameters = function () {
            var deferred = $q.defer();
            if (searchObject[URL_PARAMETERS.INACTIVE_TEAMS]) {
                $scope.showInactiveTeams = searchObject[URL_PARAMETERS.INACTIVE_TEAMS];
                //change from String to boolean
                $scope.showInactiveTeams = $scope.showInactiveTeams !== 'false';
            }

            if (searchObject[URL_PARAMETERS.UNTAGGED_TEAMS] && searchObject[URL_PARAMETERS.UNTAGGED_TEAMS] !== '') {
                $scope.showUntaggedTeams = searchObject[URL_PARAMETERS.UNTAGGED_TEAMS];
                if ($scope.showUntaggedTeams === 'false') {
                    //change from String to boolean
                    $scope.showUntaggedTeams = false;
                } else {
                    TeamsFilter.getActiveOrAllTeamsWithNoTeamTags($scope.showInactiveTeams).then(function (teams) {
                        $scope.teamsWithNoTeamTags = true;
                        $scope.checkUnTaggedTeams = true;
                        $scope.showUntaggedTeams = true;
                        $scope.clientTeams = teams;

                    });

                }
            }
            deferred.resolve($scope.clientTeams);
            return deferred.promise;
        };

        $scope.setGroupUrlParameter = function () {
            var groupIdForURL = '0';
            if ($scope.selectedGroup && $scope.selectedGroup.entity && $scope.selectedGroup.entity.id) {
                groupIdForURL = $scope.selectedGroup.entity.id;
            }
            $location.search(URL_PARAMETERS.SELECTED_GROUP, groupIdForURL).replace();
            $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
        };

        $scope.setTagsUrlParameter = function () {
            var tagIds = [];
            angular.forEach($scope.filterTags, function (filteredTag) {
                tagIds.push(filteredTag.id);
            });
            tagIds = tagIds.join(',');
            $location.search(URL_PARAMETERS.SELECTED_TAGS, tagIds).replace();
            $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
        };

        $scope.setInactiveTeamsURLParameter = function () {
            $location.search(URL_PARAMETERS.INACTIVE_TEAMS, $scope.showInactiveTeams).replace();
            $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
        };

        $scope.setUntaggedTeamsURLParameter = function () {
            $location.search(URL_PARAMETERS.UNTAGGED_TEAMS, $scope.showUntaggedTeams).replace();
            $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
        };

        $scope.selectTeam = function (id) {
            $location.search('team', id).replace();
            $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
        };

    });
