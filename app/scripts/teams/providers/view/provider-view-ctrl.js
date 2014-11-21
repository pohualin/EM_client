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
	
	.controller('ProviderListController', function($scope, $modal, ProviderView, TeamLocation, TeamProviderService){
        
		if($scope.teamResource){
        	ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
	        	ProviderView.convertLinkObjects(response);	
	    		$scope.teamResource.teamProviders = response;
        	});
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
             // get a list of team locations by team
             TeamLocation.getTeamLocations($scope).then(function(response){
            	 $scope.multiSelectData = buildMultiSelectData($scope.teamLocations);
             });
             // get a list of existing team locations by team provider
             TeamProviderService.getTeamLocationsByTeamProvider($scope).then(function(response){
        		 $scope.selectedItems = buildMultiSelectData($scope.existingTeamLocations);
        	 });
             // get ClientProvider for external provider id
             TeamProviderService.findClientProviderByClientIdAndProviderId($scope).then(function(response){
            	 $scope.clientProvider = response;
             });
             // show the dialog box
             editProviderModal.$promise.then(editProviderModal.show);
         };

        $scope.removeProvider = function (provider) {
        	ProviderView.removeProvider(provider).then(function (){
        		ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
            		$scope.teamResource.teamProviders = response;
            	});        	
        	});
        };
        
        function buildMultiSelectData(teamLocations){
        	var options = [];
        	angular.forEach(teamLocations, function(teamLocation){
        		var option = new Object({});
        		option.id = teamLocation.entity.id;
        		option.label = teamLocation.entity.location.name;
        		option.teamLocation = teamLocation;
        		options.push(option);
        	});
        	return options;
        }
        
        function buildSelectedItem(teamLocations){
        	var options = [];
        	angular.forEach(teamLocations, function(teamLocation){
        		var option = new Object({});
        		option.id = teamLocation.id;
        		options.push(option);
        	});
        	return options;
        }
	})
;