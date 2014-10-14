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
	
	.controller('ProviderListController', function($scope, ProviderView){
    	ProviderView.allProvidersForTeam($scope.teamResource).then(function(response){
    		$scope.teamResource.providers = response;
    	});
	})
;