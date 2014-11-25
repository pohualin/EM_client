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
             // get ClientProvider for external provider id
             TeamProviderService.findClientProviderByClientIdAndProviderId($scope).then(function(response){
            	 $scope.clientProvider = response;
             });
             // get a list of team locations by team
             TeamLocation.getTeamLocations($scope.teamProvider.link.teamLocations).then(function(response){
            	 var potential = response;
            	 $scope.multiSelectData = buildMultiSelectData(potential);
            	// get a list of existing team locations by team provider
                 TeamProviderService.getTeamLocationsByTeamProvider($scope.teamProviderToBeEdit.link.findTeamLocationsByTeamProvider).then(function(response){
                	 if(response.length > 0){
                		 $scope.selectedItems = buildSelectedItem(response);
                	 } else {
                		 $scope.selectedItems = buildMultiSelectData(potential);
                	 }
                	 // show the dialog box
                     editProviderModal.$promise.then(editProviderModal.show);
            	 });
             });
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
        
        function buildSelectedItem(teamProviderTeamLocations){
        	var options = [];
        	angular.forEach(teamProviderTeamLocations, function(teamProviderTeamLocation){
        		var option = new Object({});
        		option.id = teamProviderTeamLocation.teamLocation.entity.id;
        		option.label = teamProviderTeamLocation.teamLocation.entity.location.name;
        		option.teamLocation = teamProviderTeamLocation.teamLocation;
        		option.teamProviderTeamLocation = teamProviderTeamLocation;
        		options.push(option);
        	});
        	return options;
        }
	})
;