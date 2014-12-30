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
            if (searchObject[URL_PARAMETERS.SELECTED_TAGS]&&searchObject[URL_PARAMETERS.SELECTED_TAGS]!=='') {
                var selectedTags = (searchObject[URL_PARAMETERS.SELECTED_TAGS]).split(',');
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
            if(searchObject[URL_PARAMETERS.INACTIVE_TEAMS]){
                $scope.showInactiveTeams = searchObject[URL_PARAMETERS.INACTIVE_TEAMS];
                if($scope.showInactiveTeams === 'false'){
                    $scope.showInactiveTeams = false;
                }else{
                    $scope.showInactiveTeams = true;
                    $scope.showClientTeams();
                }
            }
            if(searchObject[URL_PARAMETERS.UNTAGGED_TEAMS]){
                $scope.showUntaggedTeams = searchObject[URL_PARAMETERS.UNTAGGED_TEAMS];
                if($scope.showUntaggedTeams === 'false'){
                    $scope.showUntaggedTeams = false;
                    $scope.showClientTeams();
                }else{
                    $scope.clientTeams = $scope.teamsWithNoTeamTags;
                    $scope.checkUnTaggedTeams = true;
                    $scope.showUntaggedTeams = true;
                }
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

        $scope.setInactiveTeamsURL = function(){
            $location.search(URL_PARAMETERS.INACTIVE_TEAMS, $scope.showInactiveTeams).replace();
            $scope.currentRouteQueryString = arrays.toQueryString($location.search());
        };

        $scope.setUntaggedTeamsURL = function(){
            $location.search(URL_PARAMETERS.UNTAGGED_TEAMS, $scope.showUntaggedTeams).replace();
            $scope.currentRouteQueryString = arrays.toQueryString($location.search());
        };


    });
