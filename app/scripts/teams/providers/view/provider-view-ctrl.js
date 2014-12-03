'use strict';
angular.module('emmiManager')

	.controller('TeamProviderCommon', function($scope, ProviderView, ProviderSearch){
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
        
        $scope.refreshLocationsAndProviders = function() {
        	ProviderSearch.fetchLocationsForTeam($scope.teamResource).then( function (locationResponse){
				var locationsArray=[];
	        	var allLocations = locationResponse.data.content;
	        	angular.forEach(locationResponse.data.content, function(location){
	        		locationsArray.push(' '+ location.entity.location.name);
	        	});
	        	ProviderView.allProvidersForTeam($scope.teamResource, locationsArray).then(function(response){
	        		$scope.teamResource.teamProviders = response.content;
	        		$scope.handleResponse(response, 'teamProviders');      
	        	});      	
			});
        };
	})
	
	.controller('ProviderListController', function($scope, $modal, ProviderView, TeamLocation, TeamProviderService, ProviderSearch, $controller, arrays){
        
		$controller('CommonPagination', {$scope: $scope});
		
        $controller('TeamProviderCommon', {$scope: $scope});

		if($scope.teamResource){     
			$scope.refreshLocationsAndProviders();
		}
		
		var editProviderModal = $modal({
            scope: $scope,
            template: 'partials/team/provider/edit.html',
            animation: 'none',
            backdropAnimation: 'emmi-fade',
            show: false,
            backdrop: 'static'
        });
		
		 $scope.editProvider = function (teamProvider) {
             // create a copy for editing
             $scope.teamProviderToBeEdit = angular.copy(teamProvider);
             // save the original for overlay if save is clicked
             $scope.teamProvider = teamProvider;
             // get ClientProvider for external provider id
             TeamProviderService.findClientProviderByClientIdAndProviderId($scope.teamProviderToBeEdit.link.findClientProviderByClientIdProviderId).then(function(response){
            	 $scope.clientProvider = response;
             });
             // get a list of team locations by team
             TeamLocation.getTeamLocations($scope.teamProvider.link.teamLocations).then(function(response){
            	 var potential = response;
            	 $scope.multiSelectData = TeamProviderService.buildMultiSelectData(potential);
            	// get a list of existing team locations by team provider
                 TeamProviderService.getTeamLocationsByTeamProvider($scope.teamProviderToBeEdit.link.findTeamLocationsByTeamProvider).then(function(response){
                	 if(response.length > 0){
                		 $scope.selectedItems = TeamProviderService.buildSelectedItem(response);
                	 } else {
                		 $scope.selectedItems = TeamProviderService.buildMultiSelectData(potential);
                	 }
                	 // show the dialog box
                     editProviderModal.$promise.then(editProviderModal.show);
            	 });
             });
         };
		
		// when a pagination link is used
        $scope.fetchPage = function (href) {
            $scope.loading = true;
            ProviderView.fetchPageLink(href).then(function (page) {
                $scope.handleResponse(page, 'teamProviders');
        		ProviderSearch.fetchLocationsForTeam($scope.teamResource).then( function (response){
        			var allLocationsForTeam = [];
                	angular.forEach(response.data.content, function(location){
                		allLocationsForTeam.push(' '+ location.entity.location.name);
                	});
                	 angular.forEach(page.content, function(teamProvider){
                		 var locations = [];
                		 angular.forEach(teamProvider.entity.teamProviderTeamLocations, function(tptl){
                			 locations.push(' '+ tptl.teamLocation.location.name);
                		 });
                		 teamProvider.entity.locations = locations.length > 0 ? locations.toString() : (allLocationsForTeam && allLocationsForTeam.length > 0 ) ? allLocationsForTeam.toString(): '';
                		 teamProvider.link = arrays.convertToObject('rel', 'href', teamProvider.link);
            		 });
             		$scope.teamResource.teamProviders = page.content;
        		});
            }, function () {
                // error happened
                $scope.loading = false;
            });
        };

        $scope.removeProvider = function (provider) {
        	ProviderView.removeProvider(provider, $scope.teamResource).then(function (){
                $scope.refreshLocationsAndProviders();
        	});
        };
	})
;