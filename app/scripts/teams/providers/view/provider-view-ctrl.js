'use strict';
angular.module('emmiManager')

	.controller('TeamProviderCommon', function($scope, ProviderView){
        $scope.noSearch = true;

        if($scope.teamResource){
			ProviderView.specialtyRefData($scope.teamResource).then(function(response){
	        	$scope.specialties = response;
	        });
        }
        $scope.allProvidersForTeam = function() {
        	ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
        		$scope.teamResource.teamProviders = response;

        	});
        };
	})
	
	.controller('ProviderListController', function($scope, ProviderView, ProviderSearch, $controller){
        
		$controller('CommonPagination', {$scope: $scope});

		if($scope.teamResource){
    		ProviderSearch.fetchLocationsForTeam($scope.teamResource).then( function (response){
    			var locationsArray=[];
            	var allLocations = response.data.content;
            	console.log(allLocations);
            	angular.forEach(response.data.content, function(location){
            		console.log(location);
            		locationsArray.push(' '+ location.entity.location.name);
            	});
            	ProviderView.allProvidersForTeam($scope.teamResource, locationsArray).then(function(response){
            		$scope.handleResponse(response, 'teamProviders');      
            		var list = [];
            		angular.forEach(response.content, function (teamProvider){
            			list.push(teamProvider);
            		});
            		$scope.teamResource.teamProviders = list;
            	});
    		});
        }
		
		// when a pagination link is used
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            ProviderView.fetchPageLink(href).then(function (response) {
                $scope.handleResponse(response, 'teamProviders');
        		$scope.teamResource.teamProviders = response.content;

            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.removeProvider = function (provider) {
        	ProviderView.removeProvider(provider).then(function (){
        		ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
            		$scope.teamResource.teamProviders = response.content;
            	});      	
        	});
        };
	})
;