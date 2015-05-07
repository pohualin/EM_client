'use strict';

angular.module('emmiManager')

/**
 * This controller is where the behaviors for the TeamsFilter are living.
 */
    .controller('TeamsFilterController', ['$scope', '$controller', 'TeamsFilter', '$q',
        function ($scope, $controller, TeamsFilter, $q) {

            $controller('TeamsFilterInitialization', {
                $scope: $scope
            });

            /**
             * Loads all teams on a client.
             */
            $scope.showClientTeams = function () {
                $scope.useGroupDisplay = false;
                $scope.listOfTeamsByTag = null;
                $scope.clientTeams = {};
                $scope.loading = true;
                TeamsFilter.getActiveOrAllTeamsForClient($scope.showInactiveTeams).then(function (teams) {
                    //get all of the active or inactive teams including untagged teams for a client based on the showInactiveTeams variable
                    angular.forEach(teams, function (element) {
                        if (!element.name) {
                            throw new Error('Elements must have name attribute!');
                        }
                        if (!$scope.clientTeams[element.name]) {
                            //make sure element.name is unique
                            $scope.clientTeams[element.name] = element;
                        }
                    });
                }).finally(function () {
                    $scope.loading = false;
                });
            };

            /**
             * This method deals with any situation where there is an 'organize by'
             * selected. It does so by loading all (or the selected filtered subset)
             * of the teams (and tags) for the client, and then segmenting the teams
             * by 'in group' or 'out of group'
             */
            $scope.getTeamsToShowForGroup = function () {

                $scope.loading = true;

                // load all teams on the client with their tags
                var allTeamsPromise = TeamsFilter.getActiveOrAllTeamsForClient($scope.showInactiveTeams, true);

                // load filtered tags, if necessary
                var tagsThatMatchFilterPromise = $scope.filterTags && $scope.filterTags.length > 0 ?
                    TeamsFilter.getActiveOrAllTeamTagsForFilteredTags($scope.filterTags, $scope.showInactiveTeams) : null;

                // process the two sets of teams
                $q.all([allTeamsPromise, tagsThatMatchFilterPromise]).then(function (responses) {

                    TeamsFilter
                        .getTagsForGroup($scope.selectedGroup).then(function (tagsForGroup) {
                            var allTeams = responses[0],
                                filteredTeamTags = responses[1];

                            if (filteredTeamTags !== null && filteredTeamTags.length === 0) {
                                // trying to filter but no matches are found
                                $scope.useGroupDisplay = false;
                                $scope.clientTeams = null;
                            } else {
                                // determine if we are categorizing 'all teams' or 'filtered teams'
                                var teamsToSegment = filteredTeamTags === null ? allTeams :
                                    TeamsFilter.filteredTeamsAsAllTeams(filteredTeamTags, allTeams);

                                // categorize the teams that match
                                var categorized = TeamsFilter.categorizeTagsByGroup(teamsToSegment, tagsForGroup);

                                // set scope variables
                                if (categorized.listOfTeamsByTag.length > 0) {
                                    // teams are within the selected group
                                    $scope.listOfTeamsByTag = categorized.listOfTeamsByTag;
                                } else {
                                    // no teams within the selected group
                                    delete $scope.listOfTeamsByTag;
                                }
                                // set teams not in the group
                                $scope.teamsNotInGroup = categorized.listOfTeamsNotInGroup;

                                // matches have been found, use the group display
                                $scope.useGroupDisplay = true;
                            }
                        });
                }).finally(function () {
                    // update the display with the selected group
                    $scope.selectedGroupDisplay = $scope.selectedGroup;
                    $scope.loading = false;
                });
            };

            /**
             * This method shows teams when a filter has been selected but an 'organize by' has not.
             *
             * Shows the teams that have the tags selected in the 'filter by' and follow these rules
             * 2 Tags selected within the same group will produce teams that have EITHER tag 1 or tag 2
             * 2 tags selected from within different groups will produce teams that have BOTH tag 1 and tag 2
             */
            $scope.showFilteredTeams = function () {
                $scope.loading = true;
                TeamsFilter.getActiveOrAllTeamTagsForFilteredTags($scope.filterTags, $scope.showInactiveTeams).then(function (teamTags) {
                    //get the teamtags on the client that match the filter by tags the user picked
                    $scope.clientTeams = TeamsFilter.getTeamsFromTeamTags(teamTags);
                }).finally(function () {
                    $scope.useGroupDisplay = false;
                    $scope.loading = false;
                });
            };

            /**
             * Called when user click the show/hide inactive teams link
             */
            $scope.toggleInactiveTeams = function () {
                //toggle showing inactive teams, and update the url parameter
                if (!$scope.loading) {
                    $scope.showInactiveTeams = !$scope.showInactiveTeams;
                    $scope.setInactiveTeamsURLParameter();
                    $scope.updateState();
                }
            };

        }])

;
