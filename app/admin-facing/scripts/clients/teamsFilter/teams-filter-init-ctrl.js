'use strict';

angular.module('emmiManager')

/**
 * This is the initialization controller. This module requires a bunch of stuff to be loaded
 * from the back-end to display things properly. This code is not meant to be used in a
 * stand-alone way. It is in this file for organizational purposes only.
 */
    .controller('TeamsFilterInitialization', ['$scope', '$q', '$controller', 'TeamsFilter', 'Client', '$filter',
        function ($scope, $q, $controller, TeamsFilter, Client, $filter) {

            $controller('TeamsFilterUrlPersistence', {
                $scope: $scope
            });

            /**
             * This function re-loads the component completely.
             */
            $scope.initialState = function (focusOnFilter) {

                // load reference data
                var loadAllTagsForClient = TeamsFilter.getClientGroups().then(function (groups) {
                    $scope.clientGroups = groups;
                    $scope.clientTagGroupToDisplay = TeamsFilter.getClientTagsInGroups(groups);
                    return groups;
                });
                var seeIfTeamsExist = TeamsFilter.doTeamsExistForClient().then(function (page) {
                    $scope.teamsExistForClient = !!page;
                    return $scope.teamsExistForClient;
                });
                var lookForInactiveTeams = TeamsFilter.doInactiveTeamsExistForClient().then(function (page) {
                    $scope.inactiveTeams = !!page;
                    return $scope.inactiveTeams;
                });
                var lookForUntaggedTeams = TeamsFilter.doUntaggedTeamsExist().then(function (page) {
                    $scope.teamsWithNoTeamTags = !!page;
                    return $scope.teamsWithNoTeamTags;
                });

                // make reference data is fully loaded
                $q.all([
                    loadAllTagsForClient,
                    seeIfTeamsExist,
                    lookForInactiveTeams,
                    lookForUntaggedTeams]).then(function () {

                    // set inactive from url
                    $scope.setShowInactiveFromQueryString();

                    // set selected group from url
                    $scope.setSelectedGroupFromQueryString();

                    // set tags selected from url
                    $scope.setSelectedTagsFromQueryString();

                    // refresh the data based upon the state of the widget
                    $scope.updateState(focusOnFilter);

                });

            };

            /**
             * determine the states of the 'group by' box and 'filter by' drop down,
             * then loads the data from the service that is appropriate to the state.
             */
            $scope.updateState = function (focusOnFilter) {
                //if we only want to show teams with no tags
                var unTaggedSelected = $filter('filter')($scope.filterTags, {untaggedOnly: true});

                if (unTaggedSelected.length === 0) {
                    // enable all tags for selection
                    angular.forEach($scope.clientTagGroupToDisplay, function (tag) {
                        tag.disabled = false;
                    });
                    // turn of untagged-only state
                    $scope.showUntaggedTeams = false;

                    if (!$scope.selectedGroup){
                        if ($scope.filterTags && $scope.filterTags.length !== 0) {
                            $scope.showFilteredTeams(focusOnFilter);
                        } else {
                            $scope.showClientTeams();
                        }
                    } else {
                        $scope.getTeamsToShowForGroup(focusOnFilter);
                    }
                } else {
                    // set the selected filter to the un-tagged tag
                    $scope.filterTags = unTaggedSelected;

                    // show only teams with no tags
                    $scope.showUntaggedTeams = true;

                    // disable group display
                    $scope.useGroupDisplay = false;

                    // disable all tags that are not the 'untagged team' tag
                    angular.forEach($scope.clientTagGroupToDisplay, function (tag) {
                        tag.disabled = !tag.untaggedOnly;
                    });
                    // deselect any 'organize by'
                    $scope.selectedGroup = '';

                    //load all of the active or inactive teams that do not have tags assigned to them
                    TeamsFilter.getActiveOrAllTeamsWithNoTeamTags($scope.showInactiveTeams).then(function (teams) {
                        $scope.clientTeams = teams;
                    });
                }

                // update the query string to indicate the new state
                $scope.setTagsUrlParameter();
                $scope.setGroupUrlParameter();
            };

            $scope.$on('refresh-team-filter', function () {
                $scope.initialState(false);
            });

            $scope.filterTags = []; // initialize the 'selected filters' to blank
            $scope.clientId = Client.getClient().entity.id;
            // temporarily set this to true so the ui doesn't show 'no teams' while loading
            $scope.teamsExistForClient = true;
            $scope.initialState(true);

        }])
;

