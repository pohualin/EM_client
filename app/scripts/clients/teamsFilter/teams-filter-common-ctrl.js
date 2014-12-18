'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterCommon', function ($scope, $location,URL_PARAMETERS, arrays) {
        var searchObject = $location.search();
        $scope.getUrl = function () {
            angular.forEach($scope.clientGroups, function (clientGroup) {
                if (searchObject && clientGroup.entity.id === parseInt(searchObject[URL_PARAMETERS.SELECTED_GROUP])) {
                    $scope.selectedGroup = clientGroup;
                    $scope.getTeamTagsForGroup();
                }
            });
            if (searchObject.st) {
                var selectedTags = (searchObject.st).split(',');
                angular.forEach(selectedTags, function (tagToLoadFromURLid) {
                    var keepGoing = true;
                    angular.forEach($scope.defaultTeamTags, function (teamTag) {
                        if (keepGoing && searchObject && teamTag.tag.id === parseInt(tagToLoadFromURLid)) {
                            $scope.filterTags.push(teamTag.tag);
                            keepGoing = false;
                        }
                    });
                });
                $scope.showFilteredTeams();
                $scope.currentRouteQueryString = arrays.toQueryString($location.search());
            }
        };

        $scope.setGroupUrl = function () {
            var groupIdForURL = '0';
            if ($scope.selectedGroup && $scope.selectedGroup.entity && $scope.selectedGroup.entity.id) {
                groupIdForURL = $scope.selectedGroup.entity.id;
            }
            $location.search(URL_PARAMETERS.SELECTED_GROUP, groupIdForURL).replace();
            $scope.currentRouteQueryString = arrays.toQueryString($location.search());
        };

        $scope.setTagsUrl = function () {
            var tagIds = [];
            angular.forEach($scope.filterTags, function (filteredTag) {
                tagIds.push(filteredTag.id);
            });
            tagIds = tagIds.join(',');
            $location.search(URL_PARAMETERS.SELECTED_TAGS, tagIds).replace();
            $scope.currentRouteQueryString = arrays.toQueryString($location.search());
        };


    });
