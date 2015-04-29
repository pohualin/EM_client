'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterUrlPersistence', ['$scope', '$location', 'URL_PARAMETERS',
        'arrays', '$rootScope', 'TeamsFilter', '$q', '$filter',
        function ($scope, $location, URL_PARAMETERS, arrays, $rootScope, TeamsFilter, $q, $filter) {
            var searchObject = $location.search();

            /**
             * The method searches the $scope.clientGroups variable and sets the
             * $scope.selectedGroup if the client group id is present in the query
             * string
             */
            $scope.setSelectedGroupFromQueryString = function () {
                if (searchObject[URL_PARAMETERS.SELECTED_GROUP] && searchObject[URL_PARAMETERS.SELECTED_GROUP] !== '') {
                    var found = false;
                    angular.forEach($scope.clientGroups, function (clientGroup) {
                        //find the group entity for the group id in the URL
                        if (!found &&
                            angular.equals(clientGroup.entity.id, parseInt(searchObject[URL_PARAMETERS.SELECTED_GROUP]))) {
                            found = true;
                            $scope.selectedGroup = clientGroup;
                        }
                    });
                }
            };

            /**
             * This method takes the selected tag id's from the query string
             * then updates the $scope.filterTags object, selecting all values
             * from $scope.clientTagGroupToDisplay where the id in the url matches
             * the id in the tag.
             */
            $scope.setSelectedTagsFromQueryString = function () {
                if (searchObject &&
                    searchObject[URL_PARAMETERS.SELECTED_TAGS] &&
                    searchObject[URL_PARAMETERS.SELECTED_TAGS] !== '') {
                    var selectedTags = (searchObject[URL_PARAMETERS.SELECTED_TAGS]).split(',');

                    var unTaggedTagInList = false;
                    angular.forEach(selectedTags, function (tagToLoadFromURLid) {

                        if (angular.equals(tagToLoadFromURLid, '-1')) {
                            // special tag for 'untagged teams only'
                            $scope.filterTags = [{
                                text: 'Untagged Teams Only',
                                id: -1,
                                untaggedOnly: true
                            }];
                            unTaggedTagInList = true;
                        } else if (!unTaggedTagInList) {
                            $scope.filterTags.push.apply(
                                $scope.filterTags,
                                $filter('filter')($scope.clientTagGroupToDisplay, {id: tagToLoadFromURLid})
                            );
                        }
                    });
                }
            };

            /**
             * Sets the $scope.showInactiveItems variable to true or false
             * based upon the query string
             */
            $scope.setShowInactiveFromQueryString = function () {
                if (searchObject[URL_PARAMETERS.INACTIVE_TEAMS]) {
                    $scope.showInactiveTeams = searchObject[URL_PARAMETERS.INACTIVE_TEAMS];
                    //change from String to boolean
                    $scope.showInactiveTeams = $scope.showInactiveTeams !== 'false';
                }
            };

            $scope.setGroupUrlParameter = function () {
                var groupIdForURL = null;
                if ($scope.selectedGroup && $scope.selectedGroup.entity && $scope.selectedGroup.entity.id) {
                    groupIdForURL = $scope.selectedGroup.entity.id;
                }
                $location.search(URL_PARAMETERS.SELECTED_GROUP, groupIdForURL).replace();
                $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
            };

            $scope.setTagsUrlParameter = function () {
                var tagIds = [];
                angular.forEach($scope.filterTags, function (filteredTag) {
                    if (tagIds.indexOf(filteredTag.id) === -1){
                        tagIds.push(filteredTag.id);
                    }
                });
                if (tagIds.length > 0) {
                    $location.search(URL_PARAMETERS.SELECTED_TAGS, tagIds.join(',')).replace();
                } else {
                    $location.search(URL_PARAMETERS.SELECTED_TAGS, null).replace();
                }
                $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
            };

            $scope.setInactiveTeamsURLParameter = function () {
                $location.search(URL_PARAMETERS.INACTIVE_TEAMS, $scope.showInactiveTeams ? true : null).replace();
                $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
            };

            $scope.selectTeam = function (id) {
                $location.search('team', id).replace();
                $rootScope.currentRouteQueryString = arrays.toQueryString($location.search());
            };

        }]);

