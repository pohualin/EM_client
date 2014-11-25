'use strict';

angular.module('emmiManager')

/**
 *   Used to create new Provider and ClientProvider in one call
 */
    .controller('TeamProviderEditController', ['$scope', 'TeamProviderService', 'ClientProviderService', '$alert', 'Client', 'ProviderView',
        function ($scope, TeamProviderService, ClientProviderService, $alert, Client, ProviderView) {
            ClientProviderService.specialtyRefData(Client.getClient()).then(function(response){
                $scope.specialties = response;
            });

            $scope.saveProvider = function (isValid) {
            	$scope.providerFormSubmitted = true;
                if (isValid) {
                	// Compose teamProviderTeamLocationSaveRequest
	            	var teamProviderTeamLocationSaveRequest = new Object({});
	            	// Push all selectedItems to teamProviderTeamLocation only if selectedItems != select all
	            	var teamProviderTeamLocations = [];
	            	if($scope.selectedItems.length > 0 && $scope.selectedItems.length !== $scope.multiSelectData.length){
	            		angular.forEach($scope.selectedItems, function(selected){
	            			var tptl = new Object({});
	            			if(selected.teamProviderTeamLocation){
	            				tptl.teamLocation = selected.teamProviderTeamLocation.teamLocation.entity;
	            				tptl.teamProvider = selected.teamProviderTeamLocation.teamProvider.entity;
	            				tptl.id = selected.teamProviderTeamLocation.teamProviderTeamLocationId;
	            			}else {
	            				tptl.teamLocation = selected.teamLocation.entity;
	            				tptl.teamProvider = $scope.teamProvider.entity;
	            			}
	            			teamProviderTeamLocations.push(tptl);
		            	});
	            	}
	            	// Set provider and teamProviderTeamLocation to teamProviderTeamLocationSaveRequest
	            	teamProviderTeamLocationSaveRequest.provider = $scope.teamProviderToBeEdit.entity.provider;
	            	teamProviderTeamLocationSaveRequest.teamProvider = $scope.teamProviderToBeEdit.entity;
	            	teamProviderTeamLocationSaveRequest.teamProviderTeamLocations = teamProviderTeamLocations;
	            	if($scope.clientProvider){
	            		teamProviderTeamLocationSaveRequest.clientProvider = $scope.clientProvider;
	            	}
	            	$scope.teamProviderTeamLocationSaveRequest = teamProviderTeamLocationSaveRequest;
	            	// Call update service
	            	TeamProviderService.updateTeamProvider($scope).then(function(){
	            		ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
	                    	ProviderView.convertLinkObjects(response);	
	                		$scope.teamResource.teamProviders = response;
                    	});
	            		$scope.$hide();
	            	});
                } else {
                    if (!$scope.providerErrorAlert) {
                        $scope.providerErrorAlert = $alert({
                            title: ' ',
                            content: 'Please correct the below information.',
                            container: '#message-container',
                            type: 'danger',
                            show: true,
                            dismissable: false
                        });
                    }
                }
            };

            $scope.doNotDeactivateProvider = function(){
                $scope.clientProvider.provider.entity.active = true;
            };
        }
    ])
;
