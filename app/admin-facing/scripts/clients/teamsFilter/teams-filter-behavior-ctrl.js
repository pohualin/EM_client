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

            //helper method that adds listOfElements to $scope.clientTeams
            $scope.addListToClientTeams = function (listOfElements) {
                angular.forEach(listOfElements, function (element) {
                    if (!element.name) {
                        throw new Error('Elements must have name attribute!');
                    }
                    if (!$scope.clientTeams[element.name]) {
                        //make sure element.name is unique
                        $scope.clientTeams[element.name] = element;
                    }
                });
            };

            $scope.showClientTeams = function () {
                $scope.useGroupDisplay = false;
                $scope.clientTeams = {};
                TeamsFilter.getActiveOrAllTeamsForClient($scope.showInactiveTeams).then(function (teams) {
                    //get all of the active or inactive teams including untagged teams for a client based on the showInactiveTeams variable
                    $scope.addListToClientTeams(teams);
                });
            };

            /**
             * This is a group only selected query. This method loads the data
             * when an 'organize by' has been selected and the 'show' filter is
             * 'all tags'.
             */
            $scope.getTeamsToShowForGroup = function () {
                // get all teams
                var allTeams = TeamsFilter.getActiveOrAllTeamsForClient($scope.showInactiveTeams);

                //get all team tags for selected groups
                var teamsThatMatchGroup = TeamsFilter.getTagsForGroup($scope.selectedGroup).then(function (tagsInTheSelectedGroup) {
                    return TeamsFilter.getActiveOrAllTeamTagsForFilteredTags([], $scope.showInactiveTeams).then(function (clientTeamTags) {
                        return TeamsFilter.getTeamsForTags(clientTeamTags, tagsInTheSelectedGroup);
                    });
                });

                $q.all([allTeams, teamsThatMatchGroup]).then(function (responses) {
                    // trim the already matched teams from 'all teams'
                    TeamsFilter.stripAllTeamsOfTeamsByTag(responses[0], responses[1])
                        .then(function (teamsNotInGroup) {
                            $scope.useGroupDisplay = true;
                            $scope.listOfTeamsByTag = responses[1];
                            $scope.teamsNotInGroup = teamsNotInGroup;
                        });
                });
            };

            /**
             * show the teams that have the tags selected in the filter by widget and follow these rules
             * 2 Tags selected within the same group will produce teams that have EITHER tag 1 or tag 2
             * 2 tags selected from within different groups will produce teams that have BOTH tag 1 and tag 2
             */
            $scope.showFilteredTeams = function () {
                $scope.useGroupDisplay = false;
                TeamsFilter.getActiveOrAllTeamTagsForFilteredTags($scope.filterTags, $scope.showInactiveTeams).then(function (teamTags) {
                    //get the teamtags on the client that match the filter by tags the user picked
                    $scope.clientTeams = TeamsFilter.getTeamsFromTeamTags(teamTags);
                });
            };

            /**
             * This occurs when there is both a filter and an organize by.
             */
            $scope.showFilteredAndGroupedTeams = function () {

                var matchingTeams = TeamsFilter
                    .getActiveOrAllTeamTagsForFilteredTags($scope.filterTags, $scope.showInactiveTeams)
                    .then(function (clientTeamTagsMatchingFilter) {
                        var allTeams = [];
                        angular.forEach(clientTeamTagsMatchingFilter, function (teamTag) {
                            allTeams.push(teamTag.team);
                        });
                        return allTeams;
                    });


                // teams for the group
                var teamsThatMatchGroup = TeamsFilter.getTagsForGroup($scope.selectedGroup).then(function (tagsInTheSelectedGroup) {
                    return TeamsFilter.getActiveOrAllTeamTagsForFilteredTags([], $scope.showInactiveTeams).then(function (clientTeamTags) {
                        return TeamsFilter.getTeamsForTags(clientTeamTags, tagsInTheSelectedGroup);
                    });
                });

                $q.all([matchingTeams, teamsThatMatchGroup]).then(function (responses) {

                    // trim the already matched teams from 'all teams'
                    TeamsFilter.stripAllTeamsOfTeamsByTag(responses[0], responses[1])
                        .then(function (teamsNotInGroup) {
                            $scope.useGroupDisplay = true;
                            $scope.listOfTeamsByTag = responses[0];
                            $scope.teamsNotInGroup = teamsNotInGroup;
                        });
                });
            };

            /**
             * called when user click the show/hide inactive teams link
             */
            $scope.toggleInactiveTeams = function () {
                //toggle showing inactive teams, and update the url parameter
                $scope.showInactiveTeams = !$scope.showInactiveTeams;
                $scope.setInactiveTeamsURLParameter();
                $scope.updateState();
            };

        }])

;
