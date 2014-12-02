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
	
	.controller('ProviderListController', function($scope, $modal, ProviderView, TeamLocation, TeamProviderService, ProviderView, ProviderSearch, $controller){
        
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