'use strict';

angular.module('emmiManager')

/**
 * Manage Client Level users
 */
.controller('ManageClientUsersMainCtrl',
		[ '$scope', '$controller', 'Client', 'ClientUsersService', function($scope, $controller, Client, ClientUsersService) {

			$scope.fetchPage = function(href) {
                $scope.loading = true;
                ClientUsersService.fetchPage(href).then(function(clientUsers) {
                    $scope.handleResponse(clientUsers, 'clientUsers');
                }, function() {
                    $scope.loading = false;
                });
            };
			
			$scope.search = function() {
				if (!$scope.searchForm || !$scope.searchForm.query.$invalid) {
					$scope.serializeToQueryString($scope.query, 'u', null, null);
                    $scope.loading = true;
					ClientUsersService.list($scope.client, $scope.query, null).then(
						function(response) {
                            $scope.handleResponse(response, 'clientUsers');
                            $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                        }, function() {
                            $scope.loading = false;
                        });
					$scope.sortProperty = null;
				}
			};
			
			$scope.sort = function(property) {
                var sort = $scope.createSortProperty(property);
                $scope.serializeToQueryString($scope.query, 'u', null, sort);
                ClientUsersService.list($scope.client, $scope.query, sort).then(
					function(response) {
                        $scope.handleResponse(response, 'clientUsers');
                    }, function() {
                        $scope.loading = false;
                    });
				$scope.sortProperty = null;
            };

			function init() {
				$controller('CommonSearch', {$scope: $scope});
				$scope.client = Client.getClient();
				$scope.page.setTitle('Manage Users - ' + $scope.client.name);
				$scope.searchPerformed = false;
				
				// Initiate a search when $scope.query is not empty
                if ($scope.query) {
                	$scope.serializeToQueryString($scope.query, 'u', null, null);
                	ClientUsersService.list($scope.client, $scope.query, null).then(
						function(response) {
                            $scope.handleResponse(response, 'clientUsers');
                            $scope.removeStatusFilterAndTotal = $scope.total <= 0;
                        }, function() {
                            $scope.loading = false;
                        });
					$scope.sortProperty = null;
                }
			}

			init();
		}]);
