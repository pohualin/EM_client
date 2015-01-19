'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterCommon', function ($scope, $location, URL_PARAMETERS, arrays, $rootScope, TeamsFilter, $q) {
        var searchObject = $location.search();
        $scope.getGroupUrl = function () {
            if (searchObject[URL_PARAMETERS.SELECTED_GROUP] && searchObject[URL_PARAMETERS.SELECTED_GROUP] !== '') {
                var deferred = $q.defer();
                TeamsFilter.getClientGroups().then(function (groups) {
                    angular.forEach(groups, function (clientGroup) {
                        if (searchObject && clientGroup.entity.id === parseInt(searchObject[URL_PARAMETERS.SELECTED_GROUP])) {
                            $scope.selectedGroup = clientGroup;
                        }
                    });
                    deferred.resolve($scope.selectedGroup);
                });
            return deferred.promise;
            }
        };
        $scope.getTagsUrl = function () {
            if (searchObject[URL_PARAMETERS.SELECTED_TAGS] && searchObject[URL_PARAMETERS.SELECTED_TAGS] !== '') {
                var deferred = $q.defer();
                var selectedTags = (searchObject[URL_PARAMETERS.SELECTED_TAGS]).split(',');
                TeamsFilter.getActiveOrAllTeamTagsForFilteredTags({}, $scope.showInactiveTeams).then(function (teams) {
                    angular.forEach(selectedTags, function (tagToLoadFromURLid) {
                        var keepGoing = true;
                        angular.forEach(teams, function (teamTag) {
                            if (keepGoing && searchObject && teamTag.tag.id === parseInt(tagToLoadFromURLid)) {
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
        $scope.getInactiveAndUntaggedUrl = function () {
            var deferred = $q.defer();
            if (searchObject[URL_PARAMETERS.INACTIVE_TEAMS]) {
                $scope.showInactiveTeams = searchObject[URL_PARAMETERS.INACTIVE_TEAMS];
                //change from string to boolean
                $scope.showInactiveTeams = $scope.showInactiveTeams !== 'false';
            }
            if (searchObject[URL_PARAMETERS.UNTAGGED_TEAMS] && searchObject[URL_PARAMETERS.UNTAGGED_TEAMS]!== '') {
                $scope.showUntaggedTeams = searchObject[URL_PARAMETERS.UNTAGGED_TEAMS];
                if ($scope.showUntaggedTeams === 'false') {
                    $scope.showUntaggedTeams = false;
                } else {
                    TeamsFilter.getActiveOrAllTeamsWithNoTeamTags($scope.showInactiveTeams).then(function (teams) {
                        if (teams.length > 0) {
                            $scope.teamsWithNoTeamTags = teams;
                            $scope.clientTeams = teams;
                        }
                        deferred.resolve(teams);
                    });
                    $scope.checkUnTaggedTeams = true;
                    $scope.showUntaggedTeams = true;
                }
            }
            return deferred.promise;
        };

        $scope.setGroupUrl = function () {
            var groupIdForURL = '0';
            if ($scope.selectedGroup && $scope.selectedGroup.entity && $scope.selectedGroup.entity.id) {
                groupIdForURL = $scope.selectedGroup.entity.id;
            }
            $location.search(URL_PARAMETERS.SELECTED_GROUP, groupIdForURL).replace();
            $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
        };

        $scope.setTagsUrl = function () {
            var tagIds = [];
            angular.forEach($scope.filterTags, function (filteredTag) {
                tagIds.push(filteredTag.id);
            });
            tagIds = tagIds.join(',');
            $location.search(URL_PARAMETERS.SELECTED_TAGS, tagIds).replace();
            $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
        };

        $scope.setInactiveTeamsURL = function () {
            $location.search(URL_PARAMETERS.INACTIVE_TEAMS, $scope.showInactiveTeams).replace();
            $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
        };

        $scope.setUntaggedTeamsURL = function () {
            $location.search(URL_PARAMETERS.UNTAGGED_TEAMS, $scope.showUntaggedTeams).replace();
            $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
        };
    });
