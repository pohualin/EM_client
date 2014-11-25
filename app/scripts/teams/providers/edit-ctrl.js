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
                    // Compose save request
                	$scope.teamProviderTeamLocationSaveRequest = TeamProviderService.composeTeamProviderTeamLocationSaveRequest(
                			$scope.selectedItems,
                			$scope.multiSelectData,
                			$scope.teamProvider,
                			$scope.teamProviderToBeEdit,
                			$scope.clientProvider);
                	// Call update service
                	TeamProviderService.updateTeamProvider($scope.teamProviderToBeEdit.link.updateTeamProvider,
                			$scope.teamProviderTeamLocationSaveRequest).then(function(){
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
