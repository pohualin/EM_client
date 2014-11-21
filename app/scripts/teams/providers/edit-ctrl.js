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
	            	// Push all selectedItems to teamProviderTeamLocation
	            	var teamProviderTeamLocation = [];
	            	angular.forEach($scope.selectedItems, function(selected){
	            		teamProviderTeamLocation.push(selected.teamLocation.entity);
	            	});
	            	// Set provider and teamProviderTeamLocation to teamProviderTeamLocationSaveRequest
	            	teamProviderTeamLocationSaveRequest.provider = $scope.teamProviderToBeEdit.entity.provider;
	            	teamProviderTeamLocationSaveRequest.teamProvider = $scope.teamProviderToBeEdit.entity;
	            	teamProviderTeamLocationSaveRequest.teamLocations = teamProviderTeamLocation;
	            	teamProviderTeamLocationSaveRequest.clientProvider = $scope.clientProvider;
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
