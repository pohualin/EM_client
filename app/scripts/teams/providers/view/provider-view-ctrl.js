'use strict';
angular.module('emmiManager')

	.controller('TeamProviderCommon', function($scope, ProviderView, $alert){
		
		ProviderView.specialtyRefData($scope.teamResource).then(function(response){
        	$scope.specialties = response;
        });

        $scope.allProvidersForTeam = function() {
        	ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
        		$scope.teamResource.providers = response;

        	});
        };

        $scope.showErrorBanner = function () {
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
        };
	})
	
	.controller('ProviderListController', function($scope, ProviderView){
    	ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
    		$scope.teamResource.providers = response;
    	});
	})
;