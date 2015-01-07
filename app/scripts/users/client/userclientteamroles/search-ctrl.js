'use strict';

angular.module('emmiManager')

/**
 * Controller for list of UserClientUser
 */
    .controller('UsersClientUserClientTeamRolesSearchController',
		['$controller', '$scope', 'Client', 'CommonService', 'TeamsFilter', 'UserClientUserClientTeamRolesService',
        function ($controller, $scope, Client, CommonService, TeamsFilter, UserClientUserClientTeamRolesService) {

			/**
			 * Call this method to fetch next page
			 */
			$scope.fetchPage = function(url){
				$scope.loading = true;
				CommonService.fetchPage(url).then(function(response){
					CommonService.convertPageContentLinks(response);
					UserClientUserClientTeamRolesService.postProcess(response, $scope.selectedTeamRoles);
					$scope.handleResponse(response, 'userClientUserClientTeamRoles');
				});
			};

			$scope.onTagFilterChange = function(){
			    performSearch($scope.teamQuery, null, true);
			};

			/**
			 * Call when GO button is clicked
			 */
			$scope.search = function(isValid){
			    performSearch($scope.teamQuery, null, true);
			};

            /**
             * Called when column header is clicked to change sorting property
             */
            $scope.sort = function (property) {
                var sort = $scope.createSortProperty(property);
                performSearch($scope.teamQuery, sort);
            };

            function init() {
			    // include CommonSearch controller and reset searchPerformed to false
			    $controller('CommonSearch', {$scope: $scope});
			    $scope.searchPerformed = false;
                $scope.hasTeams = true;

			    // set selectedClientTeamRole to scope
				$scope.selectedClientTeamRole = UserClientUserClientTeamRolesService.getSelectedClientTeamRole();
				// set default tagFilter to scope
				$scope.tagFilter = {tag: null};

                /**
				 * See if there is any teams created with the client
				 */
				UserClientUserClientTeamRolesService.findPossible().then(function (userClientUserClientTeamRolePage) {
                    if(userClientUserClientTeamRolePage && userClientUserClientTeamRolePage.page.totalElements > 0){
                        performSearch('');
                    } else {
                        $scope.hasTeams = false;
                    }
                });

                /**
				 * fetch groups/tags of the client
				 */
				TeamsFilter.getClientGroups().then(function (groups) {
                    //all groups on client
                    TeamsFilter.getTeamsWithNoTeamTags().then(function(teams){
                        if(teams.length>0){
                            $scope.teamsWithNoTeamTags = teams;
                        }
                    });
                    $scope.clientGroups = groups;
                    $scope.clientTagGroupToDisplay = TeamsFilter.getClientTagsInGroups(groups);
                });
			}

            /**
			 * performSearch method takes search query, sort from scope then call service to get response data
			 */
			function performSearch(query, sort, recalculateStatusFilterAndTotal) {
                $scope.loading = true;

                UserClientUserClientTeamRolesService.findPossible(query, $scope.tagFilter.tag, sort).then(
                    function success(userClientUserClientTeamRolePage) {
                        if (!userClientUserClientTeamRolePage) {
                            $scope.sortProperty = sort;
                        }
                        $scope.handleResponse(userClientUserClientTeamRolePage, 'userClientUserClientTeamRoles');
                        if (recalculateStatusFilterAndTotal) {
                            $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                        }
                    }, function failure() {
                        // error happened
                        $scope.loading = false;
                    });
                // turn off the sort after the search request has been made, the response will rebuild
                $scope.sortProperty = null;
                _paq.push(['trackSiteSearch', query, 'User Client User Client Team Role Team Search']);
            }

            init();
        }
    ])
;
