'use strict';

angular.module('emmiManager')

/**
 * Manage Client Level users
 */
.controller('UsersClientMainCtrl',
		[ '$scope', '$controller', 'Client', 'UsersClientService', function($scope, $controller, Client, UsersClientService) {
			
			/**
	         * Called when fetching different pages
	         */
			$scope.fetchPage = function(href) {
                $scope.loading = true;
                UsersClientService.fetchPage(href).then(function(usersClient) {
                    $scope.handleResponse(usersClient, 'usersClient');
                }, function() {
                    $scope.loading = false;
                });
            };
			
            /**
	         * Called when GO button is clicked
	         */
			$scope.search = function() {
				if (!$scope.searchForm || !$scope.searchForm.query.$invalid) {
					$scope.serializeToQueryString($scope.query, 'u', null, null);
                    $scope.loading = true;
					UsersClientService.list($scope.client, $scope.query, null).then(
						function(response) {
                            $scope.handleResponse(response, 'usersClient');
                            $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                        }, function() {
                            $scope.loading = false;
                        });
					$scope.sortProperty = null;
				}
			};
			
			/**
	         * Called when column header is clicked to change sorting property
	         */
			$scope.sort = function(property) {
                var sort = $scope.createSortProperty(property);
                $scope.serializeToQueryString($scope.query, 'u', null, sort);
                UsersClientService.list($scope.client, $scope.query, sort).then(
					function(response) {
                        $scope.handleResponse(response, 'usersClient');
                    }, function() {
                        $scope.loading = false;
                    });
				$scope.sortProperty = null;
            };

            /**
	         * init method called when page is loading
	         */
			function init() {
				$controller('CommonSearch', {$scope: $scope});
				$scope.client = Client.getClient();
				$scope.page.setTitle('Manage Users - ' + $scope.client.name);
				$scope.searchPerformed = false;
				
				// Initiate a search when $scope.query is not empty
                if ($scope.query) {
                	$scope.serializeToQueryString($scope.query, 'u', null, null);
                	UsersClientService.list($scope.client, $scope.query, null).then(
						function(response) {
                            $scope.handleResponse(response, 'usersClient');
                            $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                        }, function() {
                            $scope.loading = false;
                        });
					$scope.sortProperty = null;
                }
			}

			init();
		}]);
