'use strict';
angular.module('emmiManager')

	.controller('TeamAddProvidersController', function ($scope, $modal, $controller) {
        $controller('TeamProviderCommon', {$scope: $scope});

	        $scope.addProviders = function () {
			   $modal({scope: $scope, template: 'partials/team/provider/search.html', animation: 'none', backdropAnimation: 'emmi-fade', show: true, backdrop: 'static'});
	        };
	})
	
	.controller('ProviderCreateController', function($scope, ProviderCreate, $controller, ProviderView, ProviderSearch){
        $controller('TeamProviderCommon', {$scope: $scope});

        $controller('CommonPagination', {$scope: $scope});

        $scope.title = 'New Provider';
        
        $scope.provider = ProviderCreate.newProvider();
        
        $scope.saveAndAddAnotherProvider = function (isValid) {
            $scope.saveProvider(isValid, true);
        };
               
        $scope.saveProvider = function (isValid, addAnother) {
            $scope.providerFormSubmitted = true;
        	if (isValid) {
	        	ProviderCreate.create($scope.provider, $scope.teamResource).then(function(response){
	                $scope.$hide();
	                ProviderSearch.fetchLocationsForTeam($scope.teamResource).then( function (locationResponse){
	    				var locationsArray=[];
	    	        	var allLocations = locationResponse.data.content;
	    	        	angular.forEach(locationResponse.data.content, function(location){
	    	        		locationsArray.push(' '+ location.entity.location.name);
	    	        	});
	    	        	ProviderView.paginatedProvidersForTeam($scope.teamResource, locationsArray).then(function(response){
	    	        		$scope.teamResource.teamProviders = response.content;
	    	        		$scope.handleResponse(response, 'teamProviders');      
		    	        	if (addAnother) {
		        				$scope.addProviders();   
			        		}
	    	        	});
	        		});
	        	});
	        }
        };
	})
;