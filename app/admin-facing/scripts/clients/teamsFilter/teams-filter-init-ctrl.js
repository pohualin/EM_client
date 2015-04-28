'use strict';

angular.module('emmiManager')

/**
 * This is the initialization controller. This module requires a bunch of stuff to be loaded
 * from the back-end to display things properly. This code is not meant to be used in a
 * stand-alone way. It is in this file for organizational purposes only.
 */
    .controller('TeamsFilterInitialization', ['$scope', '$q', '$controller', 'TeamsFilter', 'Client',
        function ($scope, $q, $controller, TeamsFilter, Client) {

            $controller('TeamsFilterUrlPersistence', {
                $scope: $scope
            });

            $scope.clientId = Client.getClient().entity.id;
            $scope.filterTags = [];
            $scope.clientId = Client.getClient().entity.id;
            $scope.showInactiveTeams = false;
            $scope.inactiveTeams = true;
            $scope.showUntaggedTeams = false;
            $scope.clientTeams = {};
            $scope.teamsExistForClient = true;
            $scope.teamsWithNoTeamTags = true;


            $scope.init = function () {

                $q.all([
                    // parse url parameters
                    $scope.getGroupUrlParameter(),
                    $scope.getTagsUrlParameter(),
                    $scope.getInactiveAndUntaggedUrlParameters()
                ]).then(function () {

                    /**
                     * get groups for clients to fill the group by dropdown
                     *  and the tags to fill the  filter by box
                     */
                    var loadAllTagsForClient = TeamsFilter.getClientGroups().then(function (groups) {
                        $scope.clientGroups = groups;
                        $scope.clientTagGroupToDisplay = TeamsFilter.getClientTagsInGroups(groups);
                    });

                    /**
                     * check if there are teams on the client, if not, dont show filtered teams widget
                     */
                    var seeIfTeamsExist = TeamsFilter.doTeamsExistForClient().then(function (page) {
                        $scope.teamsExistForClient = page;
                    });

                    /**
                     * check if there are inactive teams on the client, if not, dont show the 'show inactive teams' link
                     */
                    var lookForInactiveTeams = TeamsFilter.doInactiveTeamsExistForClient().then(function (page) {
                        if (!page) {
                            $scope.inactiveTeams = page;
                        }
                    });

                    /**
                     * check if there are teams without tags if not dont show the untagged teams checkbox
                     */
                    var lookForUntaggedTeams = TeamsFilter.doUntaggedTeamsExist().then(function (page) {
                        if (!page) {
                            $scope.teamsWithNoTeamTags = false;
                        }
                    });

                    $q.all([
                        loadAllTagsForClient,
                        seeIfTeamsExist,
                        lookForInactiveTeams,
                        lookForUntaggedTeams]).then(function () {
                        // after url is parsed and data is loaded, update the state of the widget
                        console.log('updating state');
                        $scope.updateState();
                    });

                });
            };

            /**
             * determine the states of the 'group by' box and 'filter by' drop down
             */
            $scope.updateState = function () {
                //if we only want to show teams with no tags
                if (!$scope.showUntaggedTeams) {
                    //set the selected tags or group to filter by in the url params
                    $scope.setTagsUrlParameter();
                    $scope.setGroupUrlParameter();

                    if ($scope.filterTags.length === 0 && !$scope.selectedGroup) {
                        //if no tags are selected and no group is selected
                        $scope.showClientTeams();
                        $scope.listOfTeamsByTag = null;
                    } else if ($scope.filterTags.length === 0 && $scope.selectedGroup) {
                        //if there are no tags to filter and a group is selected
                        $scope.getTeamsToShowForGroup();
                    } else if ($scope.filterTags.length !== 0 && !$scope.selectedGroup) {
                        //there are only tags to filter by and no group is selected
                        $scope.showFilteredTeams();
                    } else {
                        //if there are tags to filter and a group is selected
                        $scope.showFilteredAndGroupedTeams();
                    }
                } else {
                    // disable the tags
                    angular.forEach($scope.clientTagGroupToDisplay, function (tag) {
                        console.log('disabling tag[' + tag.id + ']');
                        tag.disabled = true;
                    });
                }
            };

            $scope.$on('refresh-team-filter', function () {
                console.log('in here');
                $scope.init();
            });
            $scope.init();

        }])
;

